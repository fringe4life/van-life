import { isRouteErrorResponse } from "react-router";

const DEFAULT_FALLBACK = "An unknown error occurred.";

interface GetRouteErrorMessageOptions {
  /** Message when `error instanceof Error` instead of `error.message`. */
  errorFallback?: string;
  /** Message when the error type is unknown or unhandled. */
  fallback?: string;
}

/**
 * Resolve a user-facing message from a route `ErrorBoundary` error.
 *
 * `throw data(message, { status })` (used by `notFound` / `serverError`) becomes
 * an `ErrorResponseImpl` — not `instanceof Error`. The thrown string is stored
 * on `error.data`. When `statusText` is omitted from the response init, React
 * Router defaults it to `"Internal Server Error"`, so `statusText` alone is
 * unreliable for loader/action errors.
 *
 * Plain `throw new Error(...)` is handled separately via `error.message`, unless
 * `errorFallback` overrides it.
 */
export function getRouteErrorMessage(
  error: unknown,
  options: GetRouteErrorMessageOptions = {}
): string {
  const fallback = options.fallback ?? DEFAULT_FALLBACK;

  if (isRouteErrorResponse(error)) {
    if (typeof error.data === "string") {
      return error.data;
    }
    return error.statusText || fallback;
  }

  if (error instanceof Error) {
    return options.errorFallback ?? error.message;
  }

  return fallback;
}
