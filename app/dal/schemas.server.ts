import { type } from "arktype";

/** Schema for validating RFC 9562 UUID version 7 identifiers. */
export const uuidv7Schema = type("string.uuid.v7#UUIDv7").describe(
  "A valid UUID v7 string"
);

export type UUIDv7 = typeof uuidv7Schema.infer;
