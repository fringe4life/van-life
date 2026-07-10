import "~/lib/arktype.config";
import { type } from "arktype";
import { MAX_ADD } from "~/constants/constants";
import { VanState, VanType } from "~/db/enums";

const vanStateSchema = type.or(
  ...Object.values(VanState).map((v) => type(`"${v}"`)),
  type("null")
);
const vanTypeSchema = type.or(
  ...Object.values(VanType).map((v) => type(`"${v}"`))
);

/**
 * Schema for adding a new van.
 * - Validates name, description, type, imageUrl, price, and optional state.
 */
export const addVanSchema = type({
  description: "string <= 1024",
  "discount?": type("string")
    .pipe((s: string) => (s === "" ? 0 : Number(s)))
    .to("0 <= number <= 50"),
  imageUrl: type("string.url").and(/unsplash.*[?&]w=/),
  name: "string <= 60",
  price: `string.numeric.parse |> 0 < number <= ${MAX_ADD}`,
  "state?": vanStateSchema,
  type: type("string.trim |> string.upper").to(vanTypeSchema),
});
