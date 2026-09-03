import { parseAsArrayOf, parseAsBoolean, parseAsStringEnum } from "nuqs";
import { DEFAULT_FILTER } from "~/features/pagination/pagination-constants";
import {
  cursorPaginationParsers,
  limitParsers,
  searchParser,
} from "~/features/pagination/parsers";
import { VAN_TYPE_LOWERCASE } from "~/features/vans/constants/van-types";
import { NUQS_DEFAULT_OPTIONS } from "~/lib/nuqs-options";

const parseAsVanType = parseAsStringEnum([...VAN_TYPE_LOWERCASE, ""])
  .withDefault(DEFAULT_FILTER)
  .withOptions(NUQS_DEFAULT_OPTIONS);

const VAN_FILTERS = ["sale", "new", ""] as const;

const parseAsVanFilter = parseAsStringEnum([...VAN_FILTERS])
  .withDefault("")
  .withOptions(NUQS_DEFAULT_OPTIONS);

const vanLegacyFilterParsers = {
  type: parseAsVanType,
  vanFilter: parseAsVanFilter,
};

const vanFiltersParser = {
  excludeInRepair: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  onlyOnSale: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  types: parseAsArrayOf(parseAsStringEnum([...VAN_TYPE_LOWERCASE]))
    .withDefault([])
    .withOptions(NUQS_DEFAULT_OPTIONS),
};

export const vansFilterUrlParsers = {
  ...vanFiltersParser,
  ...cursorPaginationParsers,
};

export const vansParsers = {
  ...cursorPaginationParsers,
  ...limitParsers,
  ...searchParser,
  ...vanFiltersParser,
  ...vanLegacyFilterParsers,
};
