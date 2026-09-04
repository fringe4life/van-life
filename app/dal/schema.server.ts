import { brand, type InferOutput, pipe, regex, string } from "valibot";

/** RFC 9562 UUID v7: version nibble `7`, RFC 4122 variant `8|9|a|b`. */
const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Schema for validating RFC 9562 UUID version 7 identifiers. */
export const uuidv7Schema = pipe(
  string(),
  regex(UUID_V7_REGEX, "A valid UUID v7 string"),
  brand("UUIDv7")
);

export type UUIDv7 = InferOutput<typeof uuidv7Schema>;
