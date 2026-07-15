import type { List, Maybe, Prettify } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";
import type { LIMITS } from "./pagination-constants";

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

export interface Limit {
  limit: number;
}

export type Limits = (typeof LIMITS)[number];

export type BasePaginationParams = Prettify<
  Limit & {
    cursor: Maybe<UUIDv7>;
    direction?: Direction;
  }
>;

export type ToPaginationParams<T> = Prettify<Items<T> & BasePaginationParams>;

export type PaginationParams = Prettify<
  BasePaginationParams & {
    sort?: SortOption;
    userId: UUIDv7;
  }
>;
