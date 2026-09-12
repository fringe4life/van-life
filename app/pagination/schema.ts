import { defineCatalog } from "~/literals/catalog";
import { DEFAULT_LIMIT, LIMITS } from "~/pagination/pagination-constants";
import type { Limits } from "~/pagination/types";

export const limit = defineCatalog(LIMITS);

export function parseLimit(value: number): Limits {
  return limit.parse(value) ?? DEFAULT_LIMIT;
}
