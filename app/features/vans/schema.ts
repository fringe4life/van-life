import {
  decimal,
  finite,
  gtValue,
  maxLength,
  maxValue,
  minLength,
  minValue,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  regex,
  string,
  toNumber,
  toUpperCase,
  transform,
  trim,
  url,
} from "valibot";
import { MAX_ADD } from "~/constants/constants";
import { VanState, VanType } from "~/db/enums";
import { defineCatalog } from "~/literals/catalog";

export const vanType = defineCatalog([
  VanType.SIMPLE,
  VanType.RUGGED,
  VanType.LUXURY,
] as const);
export const vanState = defineCatalog([
  VanState.AVAILABLE,
  VanState.IN_REPAIR,
  VanState.ON_SALE,
] as const);

export const VAN_TYPE_VALUES = vanType.values;

const vanTypeFromClientSchema = pipe(
  string(),
  trim(),
  toUpperCase(),
  picklist(vanType.values)
);

/**
 * Schema for adding a new van.
 * Name charset guarantees `getSlug(name)` is a valid URL slug.
 */
export const addVanSchema = object({
  description: pipe(string(), maxLength(1024)),
  discount: pipe(
    optional(string(), "0"),
    transform((value) => (value === "" ? 0 : Number(value))),
    number(),
    finite(),
    minValue(0),
    maxValue(50)
  ),
  imageUrl: pipe(string(), url(), regex(/unsplash.*[?&]w=/)),
  name: pipe(
    string(),
    trim(),
    minLength(1),
    maxLength(60),
    regex(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
      "Letters, numbers, single spaces only"
    )
  ),
  price: pipe(
    string(),
    decimal(),
    toNumber(),
    number(),
    finite(),
    gtValue(0),
    maxValue(MAX_ADD)
  ),
  state: optional(nullable(picklist(vanState.values))),
  type: vanTypeFromClientSchema,
});
