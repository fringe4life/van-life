import { parseAsArrayOf, parseAsBoolean, parseAsStringLiteral } from "nuqs";
import { vanType } from "~/features/vans/schema";
import { NUQS_DEFAULT_OPTIONS } from "~/lib/nuqs-options";
import {
  cursorPaginationParsers,
  limitParsers,
  searchParser,
} from "~/pagination/parsers";

const vanFiltersParser = {
  excludeInRepair: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  onlyOnSale: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  types: parseAsArrayOf(parseAsStringLiteral(vanType.values))
    .withDefault([])
    .withOptions(NUQS_DEFAULT_OPTIONS),
} as const;

export const vansFilterUrlParsers = {
  ...vanFiltersParser,
  ...cursorPaginationParsers,
} as const;

export const vansParsers = {
  ...cursorPaginationParsers,
  ...limitParsers,
  ...searchParser,
  ...vanFiltersParser,
} as const;
