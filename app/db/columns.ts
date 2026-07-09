import { text } from "drizzle-orm/sqlite-core";
import { createId } from "~/lib/id.server";
import type { UUIDv7 } from "~/types/ids.server";

/** Canonical string length of a hyphenated UUID (8-4-4-4-12). */
const UUID_V7_LENGTH = 36;

/** Branded UUID v7 text column (no default — Better Auth / callers supply id). */
export function uuidv7Column(name: string) {
  return text(name, { length: UUID_V7_LENGTH }).$type<UUIDv7>();
}

/** Primary key with app-side UUID v7 default. */
export function uuidv7PrimaryKey(name = "id") {
  return uuidv7Column(name)
    .primaryKey()
    .$defaultFn(() => createId());
}
