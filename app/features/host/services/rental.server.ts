import { parseUuidV7 } from "~/dal/parse-uuidv7.server";
import type { AppDb } from "~/db/client.server";
import {
  getHostRentedVan,
  getHostRentedVans,
  getVanForRentBySlug,
} from "~/features/host/dal/rental.server";
import {
  executeRentVanTransaction,
  executeReturnVanTransaction,
} from "~/features/host/dal/rental-transaction.server";
import { getAccountSummary } from "~/features/host/dal/transaction.server";
import type { BasePaginationParams } from "~/features/pagination/types";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import { getCost } from "~/features/vans/utils/get-cost";
import { isVanAvailable } from "~/features/vans/utils/van-state-helpers";
import type { UUIDv7 } from "~/types/ids.server";
import { caughtErrorToServiceResult } from "~/utils/domain-error.server";
import { err, ok } from "~/utils/service-result.server";
import { tryCatch } from "~/utils/try-catch.server";

export type HostRentedVan = NonNullable<
  Awaited<ReturnType<typeof getHostRentedVan>>
>;

export async function listActiveRentals(
  db: AppDb,
  renterId: UUIDv7,
  { cursor, limit, direction }: BasePaginationParams
) {
  const { data: vans } = await tryCatch(() =>
    getHostRentedVans(db, renterId, { cursor, direction, limit })
  );

  return toPagination({
    cursor,
    direction,
    items: vans,
    limit,
  });
}

export async function rentVan(db: AppDb, vanSlug: string, renterId: UUIDv7) {
  const van = await getVanForRentBySlug(db, vanSlug);

  if (!van) {
    return err({ kind: "not_found", message: "Van not found" });
  }

  if (van.hostId === renterId) {
    return err({
      kind: "forbidden",
      message: "You cannot rent your own van",
    });
  }

  if (!isVanAvailable(van)) {
    return err({
      kind: "unavailable",
      message: "This van is not available to rent",
    });
  }

  const { data, error } = await tryCatch(() =>
    executeRentVanTransaction(db, {
      hostId: van.hostId,
      renterId,
      vanId: van.id,
    })
  );

  if (error || !data) {
    return caughtErrorToServiceResult(
      error,
      "Something went wrong try again later"
    );
  }

  return ok(data);
}

export async function loadReturnRentalContext(
  db: AppDb,
  rentId: UUIDv7,
  userId: UUIDv7
) {
  const [{ data: rent }, { data: money }] = await Promise.all([
    tryCatch(() => getHostRentedVan(db, rentId, userId)),
    tryCatch(() => getAccountSummary(db, userId)),
  ]);

  return { money, rent };
}

export async function completeReturnRental(
  db: AppDb,
  {
    rentId,
    userId,
    rent,
    money,
  }: {
    rentId: UUIDv7;
    userId: UUIDv7;
    rent: HostRentedVan;
    money: number;
  }
) {
  const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);

  if (money < amountToPay) {
    return err({
      kind: "insufficient_funds",
      message: "Cannot afford to return this rental",
    });
  }

  const { data, error } = await tryCatch(() =>
    executeReturnVanTransaction(
      db,
      rentId,
      userId,
      amountToPay,
      parseUuidV7(rent.van.id)
    )
  );

  if (error || !data) {
    return caughtErrorToServiceResult(
      error,
      "Something went wrong try again later"
    );
  }

  return ok(data);
}
