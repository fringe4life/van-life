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

const VAN_STATES = [
  VanState.AVAILABLE,
  VanState.IN_REPAIR,
  VanState.ON_SALE,
] as const;
const VAN_TYPES = [VanType.LUXURY, VanType.RUGGED, VanType.SIMPLE] as const;

/**
 * Schema for adding a new van.
 * Name charset guarantees `getSlug(name)` is a valid URL slug.
 */
export const addVanSchema = object({
  description: pipe(string(), maxLength(1024)),
  discount: optional(
    pipe(
      string(),
      transform((value) => (value === "" ? 0 : Number(value))),
      number(),
      finite(),
      minValue(0),
      maxValue(50)
    )
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
  state: optional(nullable(picklist(VAN_STATES))),
  type: pipe(string(), trim(), toUpperCase(), picklist(VAN_TYPES)),
});
