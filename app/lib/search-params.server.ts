import { createLoader } from "nuqs/server";
import { parseOptionalUuidV7 } from "~/dal/parse-uuidv7.server";
import {
  hostPaginationParsers,
  paginationParsers,
  searchParser,
  vanFiltersParser,
} from "~/lib/parsers";
import type { UUIDv7 } from "~/types/ids.server";

// Create loaders for React Router v7
export const loadPaginationParams = createLoader(paginationParsers);
export const loadHostSearchParams = createLoader(hostPaginationParsers);
export const loadSearchParams = createLoader(searchParser);
export const loadVanFiltersParams = createLoader(vanFiltersParser);

/** Brand a pagination cursor from URL search params. */
export function parsePaginationCursor(cursor: string): UUIDv7 | undefined {
  return parseOptionalUuidV7(cursor);
}
