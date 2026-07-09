import type { SortOption } from "~/features/pagination/types";

/**
 * Generic sorting configuration for Drizzle orderBy clauses.
 */
export interface SortConfig {
  dateField: string;
  secondaryField?: string;
  valueField: string;
}

export type OrderByClause = Record<string, "asc" | "desc">;

/**
 * Creates an orderBy clause based on sort option.
 */
export function createGenericOrderBy(
  sort: SortOption,
  config: SortConfig
): OrderByClause {
  const { dateField, valueField } = config;

  switch (sort) {
    case "oldest":
      return { [dateField]: "asc" };
    case "highest":
      return { [valueField]: "desc" };
    case "lowest":
      return { [valueField]: "asc" };
    default:
      return { [dateField]: "desc" };
  }
}

export const COMMON_SORT_CONFIGS = {
  review: {
    dateField: "createdAt",
    valueField: "rating",
  } satisfies SortConfig,

  transaction: {
    dateField: "createdAt",
    valueField: "amount",
  } satisfies SortConfig,

  van: {
    dateField: "createdAt",
    valueField: "price",
  } satisfies SortConfig,
} as const;
