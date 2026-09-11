import { asc, inArray } from "drizzle-orm";
import { ENV } from "varlock/env";
import { getPlatformProxy } from "wrangler";
import type { VanInsert } from "~/db/client.server";
import { createDb } from "~/db/client.server";
import { createD1HttpDb } from "~/db/d1-http.server";
import { TransactionType, VanState } from "~/db/enums";
import type { UUIDv7 } from "~/types/ids.server";
import { getSlug } from "~/utils/get-slug";
import { user } from "./schema/auth";
import { rent, review, transaction, van } from "./schema/van";
import { rents } from "./seed-data/rents";
import { reviews } from "./seed-data/reviews";
import { transactions } from "./seed-data/transactions";
import { vans } from "./seed-data/vans";
import {
  chunksOf,
  clampRentalEndToNow,
  clearTables,
  findRentableVan,
  getCost,
  getRandomDiscount,
  getRandomId,
  getVanState,
  isVanRentable,
  shouldCompleteRental,
} from "./seed-fns";

/** First N users become hosts. Not the van catalog size — that is `vans.ts`. */
const HOST_COUNT = 3;
/** Bound params per row for D1 chunking (must stay under ~100/statement). */
const VAN_COLS = 12;
const RENT_COLS = 6;
const REVIEW_COLS = 7;
const TX_COLS = 7;

const main = async () => {
  const remote = process.argv.includes("--remote");

  // Local: Miniflare via getPlatformProxy.
  // Remote: D1 HTTP API — getPlatformProxy remote sessions hang / need tunnel.
  const proxy = remote
    ? null
    : await getPlatformProxy({
        persist: true,
      });

  const db = remote
    ? createD1HttpDb({
        accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
        databaseId: ENV.CLOUDFLARE_DATABASE_ID,
        token: ENV.CLOUDFLARE_D1_TOKEN,
      })
    : createDb(proxy?.env.DB as D1Database);

  console.info(`Seeding ${remote ? "remote (D1 HTTP)" : "local"} D1…`);

  try {
    await clearTables(db);

    const users = await db.select().from(user).orderBy(asc(user.createdAt));

    if (users.length < HOST_COUNT) {
      throw new Error(
        `Seed needs at least ${HOST_COUNT} users in the database. Create them in the app first.`
      );
    }

    const hosts = users.slice(0, HOST_COUNT);

    const vansWithHosts: VanInsert[] = vans.map((seedVan, index) => {
      const state = getVanState();
      return {
        ...seedVan,
        discount: state === VanState.ON_SALE ? getRandomDiscount() : 0,
        hostId: hosts[index % hosts.length].id,
        isRented: false,
        slug: getSlug(seedVan.name),
        state,
      };
    });

    await Promise.all(
      [...chunksOf(vansWithHosts, VAN_COLS)].map((chunk) =>
        db.insert(van).values(chunk)
      )
    );

    const vanRecords = await db.select().from(van);
    const vanById = new Map(vanRecords.map((v) => [v.id, v]));

    const vansRented = new Set<UUIDv7>();
    const vansReturned: UUIDv7[] = [];

    const rentsWithIds = rents.map((seedRent) => {
      let vanId = getRandomId(vanRecords);

      // Unbounded. Hangs if every van is already in vansRented.
      // Invariant + fix: MAX_ACTIVE_SEED_RENTS in seed-fns.ts.
      while (vansRented.has(vanId)) {
        vanId = getRandomId(vanRecords);
      }

      let selectedVan = vanById.get(vanId);
      if (!selectedVan) {
        throw new Error(`Van ${vanId} not found`);
      }

      if (!isVanRentable(selectedVan.state)) {
        vanId = findRentableVan(vanRecords, vanById, vansRented);
        selectedVan = vanById.get(vanId);
        if (!selectedVan) {
          throw new Error(`Rentable van ${vanId} not found`);
        }
      }

      const { hostId } = selectedVan;
      const renterPool = users.filter((u) => u.id !== hostId);
      if (renterPool.length === 0) {
        throw new Error("Need at least one renter who is not the van host");
      }
      const renterId = getRandomId(renterPool);

      const { rentedAt } = seedRent;
      const rentedTo = shouldCompleteRental(vansRented.size)
        ? clampRentalEndToNow(rentedAt)
        : null;
      if (rentedTo) {
        vansReturned.push(vanId);
      } else {
        vansRented.add(vanId);
      }

      return {
        hostId,
        rentedAt,
        rentedTo,
        renterId,
        vanId,
      };
    });

    const createdRents = (
      await Promise.all(
        [...chunksOf(rentsWithIds, RENT_COLS)].map((chunk) =>
          db.insert(rent).values(chunk).returning()
        )
      )
    ).flat();

    if (vansRented.size > 0) {
      await db
        .update(van)
        .set({ isRented: true })
        .where(inArray(van.id, [...vansRented]));
    }

    const rentalTransactions = createdRents.flatMap((r) => {
      if (r.rentedTo === null) {
        return [];
      }

      const rentedVan = vanById.get(r.vanId);
      if (!rentedVan) {
        throw new Error(`Van ${r.vanId} not found for rental transaction`);
      }
      const amount = getCost(r.rentedAt, r.rentedTo, rentedVan.price);

      return [
        {
          amount: -amount,
          createdAt: r.rentedTo,
          description: `Payment for van rental ${r.vanId}`,
          rentId: r.id,
          type: TransactionType.RENTAL_RETURN,
          userId: r.renterId,
        },
        {
          amount,
          createdAt: r.rentedTo,
          description: `Received payment for van ${r.vanId}`,
          rentId: r.id,
          type: TransactionType.RENTAL_PAYMENT,
          userId: r.hostId,
        },
      ];
    });

    await Promise.all(
      [...chunksOf(rentalTransactions, TX_COLS)].map((chunk) =>
        db.insert(transaction).values(chunk)
      )
    );

    const completedRents = createdRents.filter((r) => r.rentedTo !== null);
    if (completedRents.length === 0) {
      throw new Error(
        "Seed produced no completed rents; cannot attach reviews"
      );
    }

    const reviewsWithIds = reviews.map((seedReview, index) => {
      const completedRent = completedRents[index % completedRents.length];
      return {
        ...seedReview,
        rentId: completedRent.id,
        userId: completedRent.renterId,
      };
    });

    await Promise.all(
      [...chunksOf(reviewsWithIds, REVIEW_COLS)].map((chunk) =>
        db.insert(review).values(chunk)
      )
    );

    const transactionsWithIds = transactions.map((seedTx, index) => ({
      ...seedTx,
      userId: hosts[index % hosts.length].id,
    }));

    await Promise.all(
      [...chunksOf(transactionsWithIds, TX_COLS)].map((chunk) =>
        db.insert(transaction).values(chunk)
      )
    );

    const vansPerHost = hosts.map(
      (host) => vansWithHosts.filter((v) => v.hostId === host.id).length
    );

    const rentHostById = new Map(createdRents.map((r) => [r.id, r.hostId]));
    const reviewCountByHost = new Map<string, number>();
    for (const rev of reviewsWithIds) {
      const hostId = rentHostById.get(rev.rentId);
      if (!hostId) {
        continue;
      }
      reviewCountByHost.set(hostId, (reviewCountByHost.get(hostId) ?? 0) + 1);
    }

    const hostLines = hosts.map((host) => {
      const hostRentCount = rentsWithIds.filter(
        (r) => r.hostId === host.id
      ).length;
      const hostReviewCount = reviewCountByHost.get(host.id) ?? 0;
      const hostWalletCount = transactionsWithIds.filter(
        (tx) => tx.userId === host.id
      ).length;
      return `${host.name}: ${hostRentCount} rents / ${hostReviewCount} reviews / ${hostWalletCount} wallet txs`;
    });

    console.info(
      `Seed complete. ${vans.length} vans (${vansPerHost.join("/")} per host), ${createdRents.length} rents, ${rentalTransactions.length} rental txs, ${reviewsWithIds.length} reviews, ${transactionsWithIds.length} user txs.`
    );
    for (const line of hostLines) {
      console.info(`  ${line}`);
    }
  } finally {
    await proxy?.dispose();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
