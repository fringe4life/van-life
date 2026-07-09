import { and, asc, desc, eq, gt, lt, type SQL } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { van } from "~/db/schema/van";
import type { BasePaginationParams } from "~/features/pagination/types";
import { getCursorMetadata } from "~/features/pagination/utils/get-cursor-metadata.server";
import type { UUIDv7 } from "~/types/ids.server";

export async function getHostVanBySlug(
  db: AppDb,
  userId: UUIDv7,
  vanSlug: string
) {
  const [result] = await db
    .select()
    .from(van)
    .where(and(eq(van.hostId, userId), eq(van.slug, vanSlug)))
    .limit(1);
  return result ?? null;
}

export function getHostVans(
  db: AppDb,
  hostId: UUIDv7,
  { cursor, limit, direction }: BasePaginationParams
) {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const conditions: SQL[] = [eq(van.hostId, hostId)];

  if (cursorId) {
    conditions.push(
      orderBy.id === "desc" ? lt(van.id, cursorId) : gt(van.id, cursorId)
    );
  }

  const idOrder = orderBy.id === "desc" ? desc(van.id) : asc(van.id);

  return db
    .select()
    .from(van)
    .where(and(...conditions))
    .orderBy(idOrder)
    .limit(take);
}
