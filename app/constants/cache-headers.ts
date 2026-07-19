import { FIVE_MINUTES_IN_SECONDS } from "~/constants/time-constants";

/** Host / auth responses — never store in shared or browser HTTP caches. */
export const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
} as const satisfies HeadersInit;

/**
 * Public catalog / marketing pages for Workers Cache + browsers.
 * Vary: Cookie keeps layout hasAuth variants from leaking across users.
 */
export const PUBLIC_SHORT_CACHE_HEADERS = {
  "Cache-Control": `public, max-age=${FIVE_MINUTES_IN_SECONDS}`,
  Vary: "Cookie",
} as const satisfies HeadersInit;

function hasAnyHeaders(headers: Headers): boolean {
  return [...headers].length > 0;
}

/**
 * React Router does not send `data(..., { headers })` automatically.
 * Leaf routes must export `headers` and return loader/action headers.
 * @see https://reactrouter.com/how-to/headers
 */
export function forwardDataHeaders({
  actionHeaders,
  loaderHeaders,
}: {
  actionHeaders: Headers;
  loaderHeaders: Headers;
}): Headers {
  return hasAnyHeaders(actionHeaders) ? actionHeaders : loaderHeaders;
}
