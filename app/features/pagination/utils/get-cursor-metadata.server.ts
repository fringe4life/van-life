import type {
  BasePaginationParams,
  CursorMetadata,
} from "~/features/pagination/types";

/**
 * Cursor pagination metadata for Drizzle queries.
 * Use cursorId with lt/gt on id + limit(take).
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
