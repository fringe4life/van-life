import type {
  BasePaginationParams,
  SortObject,
} from "~/features/pagination/types";
import {
  createGenericOrderBy,
  type OrderByClause,
  type SortConfig,
} from "~/lib/generic-sorting.server";
import type { Prettify } from "~/types";
import { getCursorMetadata } from "./get-cursor-metadata.server";
import { reverseSortOption } from "./reverse-sort-order";

type ResolveSortedCursorParams = Prettify<
  BasePaginationParams & Partial<SortObject>
>;

interface ResolvedSortedCursor {
  cursorId: ReturnType<typeof getCursorMetadata>["cursorId"];
  orderBy: ReturnType<typeof getCursorMetadata>["orderBy"];
  orderByClause: OrderByClause;
  take: number;
}

/**
 * Cursor metadata + direction-aware sort clause for sorted paginated queries.
 */
export function resolveSortedCursor(
  {
    cursor,
    limit,
    direction = "forward",
    sort = "newest",
  }: ResolveSortedCursorParams,
  sortConfig: SortConfig
): ResolvedSortedCursor {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const effectiveSort = reverseSortOption(sort, direction);
  const orderByClause = createGenericOrderBy(effectiveSort, sortConfig);

  return { cursorId, orderBy, orderByClause, take };
}
