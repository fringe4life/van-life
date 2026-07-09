import { createSerializer } from "nuqs/server";
import { validateLimit } from "~/features/pagination/utils/validators";
import {
  paginationParsers,
  searchParser,
  vanFiltersParser,
} from "~/lib/parsers";
import type { Maybe } from "~/types";

const combinedVanParsers = {
  ...paginationParsers,
  ...vanFiltersParser,
  ...searchParser,
};
const serializeVanParams = createSerializer(combinedVanParsers);

export interface VanSearchParams {
  cursor: string;
  excludeInRepair?: Maybe<boolean>;
  limit: number;
  onlyOnSale?: Maybe<boolean>;
  search?: Maybe<string>;
  types?: Maybe<string[]>;
}

type VanQueryParams = Record<string, string | number | string[] | boolean>;

function getOptionalVanFilterParams({
  types,
  excludeInRepair,
  onlyOnSale,
  search,
}: Pick<
  VanSearchParams,
  "types" | "excludeInRepair" | "onlyOnSale" | "search"
>): VanQueryParams {
  return {
    ...(types?.length ? { types } : {}),
    ...(excludeInRepair === true ? { excludeInRepair: true } : {}),
    ...(onlyOnSale === true ? { onlyOnSale: true } : {}),
    ...(search?.trim() ? { search: search.trim() } : {}),
  };
}

function buildVanQueryParams(params: VanSearchParams): VanQueryParams {
  return {
    cursor: params.cursor,
    limit: validateLimit(params.limit),
    ...getOptionalVanFilterParams(params),
  };
}

function normalizeQueryString(query: string): string {
  if (query.startsWith("?")) {
    return query.slice(1);
  }
  return query;
}

function joinBaseUrl(baseUrl: string, query: string): string {
  if (!query) {
    return baseUrl;
  }
  return `${baseUrl}?${query}`;
}

/**
 * Builds query string for van routes (no leading `?`).
 */
export function buildVanQueryString(params: VanSearchParams): string {
  const queryString = serializeVanParams(buildVanQueryParams(params));
  return normalizeQueryString(queryString);
}

/**
 * Builds full URL with van route query string.
 */
export function buildVanUrl(
  params: VanSearchParams & { baseUrl: string }
): string {
  const { baseUrl, ...searchParams } = params;
  return joinBaseUrl(baseUrl, buildVanQueryString(searchParams));
}
