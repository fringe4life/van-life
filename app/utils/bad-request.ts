import { data } from "react-router";

/**
 * Return a 400 Bad Request payload from an action.
 * Skips automatic loader revalidation in React Router while still exposing
 * the body to `actionData` / `fetcher.data` for inline form errors.
 */
export function badRequest<T>(payload: T) {
  return data(payload, { status: 400 });
}
