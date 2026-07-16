import { data } from "react-router";

/**
 * Return a 409 Conflict payload from an action.
 * Skips automatic loader revalidation while exposing the body to
 * `actionData` / `fetcher.data` for inline form errors.
 */
export function conflict<T>(payload: T) {
  return data(payload, { status: 409 });
}
