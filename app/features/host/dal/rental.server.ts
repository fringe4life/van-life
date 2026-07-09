import { and, asc, desc, eq, gt, isNull, lt, type SQL } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { rent, van } from "~/db/schema/van";
import type { BasePaginationParams } from "~/features/pagination/types";
import { getCursorMetadata } from "~/features/pagination/utils/get-cursor-metadata.server";
import type { UUIDv7 } from "~/types/ids.server";

export async function getHostRentedVan(
  db: AppDb,
  rentId: UUIDv7,
  renterId: UUIDv7
) {
  const rows = await db
    .select({
      rent,
      van,
    })
    .from(rent)
    .innerJoin(van, eq(rent.vanId, van.id))
    .where(
      and(
        eq(rent.id, rentId),
        eq(rent.renterId, renterId),
        isNull(rent.rentedTo)
      )
    )
    .limit(1);

  const [row] = rows;
  if (!row) {
    return;
  }
  return { ...row.rent, van: row.van };
}

export async function getHostRentedVans(
  db: AppDb,
  renterId: UUIDv7,
  { cursor, limit, direction }: BasePaginationParams
) {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const conditions: SQL[] = [
    eq(rent.renterId, renterId),
    isNull(rent.rentedTo),
  ];

  if (cursorId) {
    conditions.push(
      orderBy.id === "desc" ? lt(rent.id, cursorId) : gt(rent.id, cursorId)
    );
  }

  const idOrder = orderBy.id === "desc" ? desc(rent.id) : asc(rent.id);

  const rows = await db
    .select({
      rent,
      van,
    })
    .from(rent)
    .innerJoin(van, eq(rent.vanId, van.id))
    .where(and(...conditions))
    .orderBy(idOrder)
    .limit(take);

  return rows.map((row) => ({ ...row.rent, van: row.van }));
}
