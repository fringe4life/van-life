import { parseAsNumberLiteral, parseAsString, parseAsStringEnum } from "nuqs";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
  DEFAULT_LIMIT,
  DIRECTIONS,
  LIMITS,
} from "~/features/pagination/pagination-constants";
import type { Direction } from "~/features/pagination/types";

const parseAsLimit = parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT);

export const limitParsers = {
  limit: parseAsLimit,
};

export const cursorPaginationParsers = {
  cursor: parseAsString.withDefault(DEFAULT_CURSOR),
  direction:
    parseAsStringEnum<Direction>(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
};
