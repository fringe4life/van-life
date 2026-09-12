import {
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { NUQS_DEFAULT_OPTIONS } from "~/lib/nuqs-options";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  DIRECTIONS,
  LIMITS,
  SORT_OPTIONS,
} from "~/pagination/pagination-constants";

export const limitParsers = {
  limit: parseAsNumberLiteral(LIMITS)
    .withDefault(DEFAULT_LIMIT)
    .withOptions(NUQS_DEFAULT_OPTIONS),
};

export const cursorPaginationParsers = {
  cursor: parseAsString
    .withDefault(DEFAULT_CURSOR)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  direction: parseAsStringLiteral(DIRECTIONS)
    .withDefault(DEFAULT_DIRECTION)
    .withOptions(NUQS_DEFAULT_OPTIONS),
};

export const searchParser = {
  search: parseAsString.withDefault("").withOptions(NUQS_DEFAULT_OPTIONS),
};

export const hostPaginationParsers = {
  ...cursorPaginationParsers,
  ...limitParsers,
  sort: parseAsStringLiteral(SORT_OPTIONS)
    .withDefault(DEFAULT_SORT)
    .withOptions(NUQS_DEFAULT_OPTIONS),
};

export const searchUrlParsers = {
  ...searchParser,
  ...cursorPaginationParsers,
};
