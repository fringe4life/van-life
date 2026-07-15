import type { Status } from "~/components/status-button";
import type { Ok } from "~/types";

/** Minimal shape: FormActionResult discriminant. */
type ActionOkResult = Partial<Ok>;

type FetcherState = "idle" | "submitting" | "loading";

interface GetFetcherStatusOptions {
  /**
   * Cover the gap before `fetcher.submit` flips state (e.g. submit `useTransition`).
   *
   * Pass **only** pending that means this form is submitting. After success,
   * `data.ok === true` usually sticks until the next submit; a spurious
   * pending→idle cycle (another `startTransition` on the same `useTransition`,
   * radio toggles, filters, etc.) remaps to `success` again. Piped through
   * `useAutoIdleStatus`, that looks like a success flash with no submit.
   */
  isTransitionPending?: boolean;
}

interface GetNavigationFormStatusOptions {
  /** True when this form (not unrelated nav) is submitting. */
  isFormNavigation?: boolean;
}

/**
 * Map React Router fetcher state + action data to a {@link Status} for StatusButton.
 *
 * - Non-idle / transition pending → `pending`
 * - Idle + `ok: true` → `success`
 * - Idle + `ok: false` → `error`
 * - Idle + no / unknown data → `idle`
 */
const getFetcherStatus = (
  state: FetcherState,
  data?: ActionOkResult | null,
  options: GetFetcherStatusOptions = {}
): Status => {
  if (options.isTransitionPending || state !== "idle") {
    return "pending";
  }

  if (data?.ok === true) {
    return "success";
  }

  if (data?.ok === false) {
    return "error";
  }

  return "idle";
};

/**
 * Same mapping for document navigation forms (`Form` / `CustomForm` + `actionData`).
 */
const getNavigationFormStatus = (
  navigationState: "idle" | "submitting" | "loading",
  actionData?: ActionOkResult | null,
  options: GetNavigationFormStatusOptions = {}
): Status => {
  const isFormBusy = options.isFormNavigation ?? navigationState !== "idle";

  if (isFormBusy && navigationState !== "idle") {
    return "pending";
  }

  if (actionData?.ok === true) {
    return "success";
  }

  if (actionData?.ok === false) {
    return "error";
  }

  return "idle";
};

export { getFetcherStatus, getNavigationFormStatus };
