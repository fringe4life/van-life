import { asc, inArray } from "drizzle-orm";
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
  clearTables,
  findRentableVan,
  getCost,
  getEndDate,
  getRandomDiscount,
  getRandomId,
  getRecentRentalDate,
  getVanState,
  isVanRentable,
  randomTrueOrFalse,
} from "./seed-fns";

const HOST_COUNT = 3;
/** Bound params per row for D1 chunking (must stay under ~100/statement). */
const VAN_COLS = 12;
const RENT_COLS = 6;
const REVIEW_COLS = 7;
const TX_COLS = 7;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN for remote seed (D1 edit token).`
    );
  }
  return value;
}

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
        accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
        databaseId: requireEnv("CLOUDFLARE_DATABASE_ID"),
        token: requireEnv("CLOUDFLARE_D1_TOKEN"),
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

      const recentRentalDate = getRecentRentalDate();
      const rentedTo = randomTrueOrFalse()
        ? getEndDate(recentRentalDate)
        : null;
      if (rentedTo) {
        vansReturned.push(vanId);
      } else {
        vansRented.add(vanId);
      }

      return {
        ...seedRent,
        hostId,
        rentedAt: recentRentalDate,
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

    const reviewsWithIds = reviews.map((seedReview) => ({
      ...seedReview,
      rentId: getRandomId(completedRents),
      userId: getRandomId(users),
    }));

    await Promise.all(
      [...chunksOf(reviewsWithIds, REVIEW_COLS)].map((chunk) =>
        db.insert(review).values(chunk)
      )
    );

    const transactionsWithIds = transactions.map((seedTx) => ({
      ...seedTx,
      userId: getRandomId(users),
    }));

    await Promise.all(
      [...chunksOf(transactionsWithIds, TX_COLS)].map((chunk) =>
        db.insert(transaction).values(chunk)
      )
    );

    const vansPerHost = hosts.map(
      (host) => vansWithHosts.filter((v) => v.hostId === host.id).length
    );

    console.info(
      `Seed complete. ${vans.length} vans (${vansPerHost.join("/")} per host), ${createdRents.length} rents, ${rentalTransactions.length} rental txs, ${reviewsWithIds.length} reviews, ${transactionsWithIds.length} user txs.`
    );
  } finally {
    await proxy?.dispose();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
