import { createLoader } from "nuqs/server";
import { parseOptionalUuidV7 } from "~/dal/parse-uuidv7.server";
import { hostPaginationParsers } from "~/features/pagination/parsers";
import type { UUIDv7 } from "~/types/ids.server";

export const loadHostSearchParams = createLoader(hostPaginationParsers);

/** Brand a pagination cursor from URL search params. */
export function parsePaginationCursor(cursor: string): UUIDv7 | undefined {
  return parseOptionalUuidV7(cursor);
}
