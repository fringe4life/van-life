import type {
  BasePaginationParams,
  CursorMetadata,
} from "~/features/pagination/types";

/**
 * Cursor metadata for queries whose primary ORDER BY is `id`.
 * Use cursorId with lt/gt on id + limit(take).
 * Sorted lists (date/amount/rating) must use a keyset tuple instead —
 * see createKeysetCursorPredicate + resolveSortedCursor.
 */
export const getCursorMetadata = ({
  cursor,
  limit,
  direction = "forward",
}: BasePaginationParams): CursorMetadata => {
  const normalisedCursor = cursor && cursor !== "" ? cursor : undefined;

  const orderBy: CursorMetadata["orderBy"] = {
    id: direction === "backward" ? "asc" : "desc",
  };

  const take = limit + 1;

  return {
    cursorId: normalisedCursor,
    orderBy,
    take,
  };
};
