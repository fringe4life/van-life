import { parseAsArrayOf, parseAsBoolean, parseAsStringLiteral } from "nuqs";
import {
  fallback,
  is,
  parse,
  picklist,
  pipe,
  string,
  toUpperCase,
  trim,
} from "valibot";
import { VanType } from "~/db/enums";
import {
  cursorPaginationParsers,
  limitParsers,
  searchParser,
} from "~/features/pagination/schema";
import { NUQS_DEFAULT_OPTIONS } from "~/lib/nuqs-options";
import type { List } from "~/types";

export const VAN_TYPE_VALUES = [
  VanType.SIMPLE,
  VanType.RUGGED,
  VanType.LUXURY,
] as const;

const vanTypeSchema = picklist(VAN_TYPE_VALUES);

/** URL/form van type → DB `VanType`. */
export const vanTypeFromClientSchema = pipe(
  string(),
  trim(),
  toUpperCase(),
  vanTypeSchema
);

export function parseVanType(value: unknown): VanType {
  return parse(fallback(vanTypeFromClientSchema, VanType.SIMPLE), value);
}

export const toValidTypes = (types: List<string>): VanType[] =>
  (types ?? []).filter((type) => is(vanTypeSchema, type));

const vanFiltersParser = {
  excludeInRepair: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  onlyOnSale: parseAsBoolean
    .withDefault(false)
    .withOptions(NUQS_DEFAULT_OPTIONS),
  types: parseAsArrayOf(parseAsStringLiteral(VAN_TYPE_VALUES))
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
};
