import { data } from "react-router";

/**
 * Return a 500 payload from an action (does not throw).
 * Use when the form should keep showing inline `formError`.
 * Prefer {@link serverError} from `~/utils/server-error` in loaders
 * when a full ErrorBoundary page is desired.
 */
export function internalError<T>(payload: T) {
  return data(payload, { status: 500 });
}
