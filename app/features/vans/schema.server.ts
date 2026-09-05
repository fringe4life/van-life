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
  transform,
  trim,
  url,
} from "valibot";
import { MAX_ADD } from "~/constants/constants";
import { VanState } from "~/db/enums";
import { vanTypeFromClientSchema } from "~/features/vans/schema";

const VAN_STATES = [
  VanState.AVAILABLE,
  VanState.IN_REPAIR,
  VanState.ON_SALE,
] as const;

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
  type: vanTypeFromClientSchema,
});
