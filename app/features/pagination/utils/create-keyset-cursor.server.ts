import { and, eq, gt, lt, or, type SQL, type SQLWrapper } from "drizzle-orm";

export type SortDirection = "asc" | "desc";

/**
 * Exclusive keyset (tuple) seek: compare the primary sort value, then id.
 * Predicates must match ORDER BY sortCol dir, idCol dir.
 */
export function createKeysetCursorPredicate({
  cursorId,
  idColumn,
  idDirection,
  sortColumn,
  sortDirection,
  sortValue,
}: {
  cursorId: string;
  idColumn: SQLWrapper;
  idDirection: SortDirection;
  sortColumn: SQLWrapper;
  sortDirection: SortDirection;
  sortValue: unknown;
}): SQL {
  const pastSortValue =
    sortDirection === "desc"
      ? lt(sortColumn, sortValue)
      : gt(sortColumn, sortValue);
  const pastId =
    idDirection === "desc" ? lt(idColumn, cursorId) : gt(idColumn, cursorId);

  const predicate = or(pastSortValue, and(eq(sortColumn, sortValue), pastId));

  if (!predicate) {
    throw new Error("Failed to build keyset cursor predicate");
  }

  return predicate;
}
