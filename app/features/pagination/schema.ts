import {
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { fallback, parse, picklist } from "valibot";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  DIRECTIONS,
  LIMITS,
  SORT_OPTIONS,
} from "~/features/pagination/pagination-constants";
import type { Limits } from "~/features/pagination/types";
import { NUQS_DEFAULT_OPTIONS } from "~/lib/nuqs-options";

const limitSchema = picklist(LIMITS);

export function parseLimit(value: number): Limits {
  return parse(fallback(limitSchema, DEFAULT_LIMIT), value);
}

const parseAsLimit = parseAsNumberLiteral(LIMITS)
  .withDefault(DEFAULT_LIMIT)
  .withOptions(NUQS_DEFAULT_OPTIONS);

export const limitParsers = {
  limit: parseAsLimit,
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
