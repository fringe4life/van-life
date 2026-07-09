import type { List, Maybe, Prettify } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";

export type Direction = "forward" | "backward";

export type SortOption = "newest" | "oldest" | "highest" | "lowest";

type SortOrder = "asc" | "desc";

export interface PaginationMetadata {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Items<T> {
  items: List<T>;
}

export type PaginationProps<T> = Prettify<
  Items<T> & {
    paginationMetadata: PaginationMetadata;
  }
>;

export interface CursorMetadata {
  cursorId: Maybe<UUIDv7>;
  orderBy: { id: SortOrder };
  take: number;
}

export interface BasePaginationParams {
  cursor: Maybe<UUIDv7>;
  direction?: Direction;
  limit: number;
}

export type ToPaginationParams<T> = Prettify<Items<T> & BasePaginationParams>;

export type PaginationParams = Prettify<
  BasePaginationParams & {
    sort?: SortOption;
    userId: UUIDv7;
  }
>;
