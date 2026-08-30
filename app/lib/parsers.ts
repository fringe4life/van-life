import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import {
  DEFAULT_FILTER,
  DEFAULT_SORT,
  SORT_OPTIONS,
} from "~/features/pagination/pagination-constants";
import {
  cursorPaginationParsers,
  limitParsers,
} from "~/features/pagination/parsers";
import type { SortOption } from "~/features/pagination/types";
import { VAN_TYPE_LOWERCASE } from "~/features/vans/constants/van-types";

const parseAsVanType = parseAsStringEnum([
  ...VAN_TYPE_LOWERCASE,
  "",
]).withDefault(DEFAULT_FILTER);

export const searchParser = { search: parseAsString.withDefault("") };

const parseAsSortOption = parseAsStringEnum<SortOption>([
  ...SORT_OPTIONS,
]).withDefault(DEFAULT_SORT);

export const hostPaginationParsers = {
  ...cursorPaginationParsers,
  ...limitParsers,
  sort: parseAsSortOption,
};

export const searchUrlParsers = {
  ...searchParser,
  ...cursorPaginationParsers,
};

const VAN_FILTERS = ["sale", "new", ""] as const;

const parseAsVanFilter = parseAsStringEnum([...VAN_FILTERS]).withDefault("");

export const paginationParsers = {
  ...hostPaginationParsers,
  type: parseAsVanType,
  vanFilter: parseAsVanFilter,
};

export const vanFiltersParser = {
  excludeInRepair: parseAsBoolean.withDefault(false),
  onlyOnSale: parseAsBoolean.withDefault(false),
  types: parseAsArrayOf(parseAsStringEnum([...VAN_TYPE_LOWERCASE])).withDefault(
    []
  ),
};

export const vansFilterUrlParsers = {
  ...vanFiltersParser,
  ...cursorPaginationParsers,
};
