import { useEffect, useState } from "react";
import type { Status } from "~/components/status-button";

/**
 * How long terminal StatusButton icons stay before returning to `idle`.
 *
 * Timing notes (icon-only, not toast copy):
 * - Toasts with text usually sit 3–5s (a11y guides often 2–7s by length).
 * - Button status icons carry almost no reading load → shorter is fine.
 * - Must reset: StatusButton disables whenever status !== `idle`, so a sticky
 *   `error`/`success` would permanently block resubmit.
 */
const STATUS_SUCCESS_IDLE_MS = 2000;
const STATUS_ERROR_IDLE_MS = 2500;

type TerminalStatus = "success" | "error";

interface UseAutoIdleStatusOptions {
  /** Override error → idle delay (ms). Default {@link STATUS_ERROR_IDLE_MS}. */
  errorMs?: number;
  /**
   * Which terminal statuses auto-clear. Default both.
   * Pass `["success"]` if you want errors to stay until the next submit.
   * Note: keeping `error` sticky leaves StatusButton disabled until resubmit clears it.
   */
  reset?: TerminalStatus[];
  /** Override success → idle delay (ms). Default {@link STATUS_SUCCESS_IDLE_MS}. */
  successMs?: number;
}

const DEFAULT_RESET: TerminalStatus[] = ["success", "error"];

/**
 * Show `success` / `error` briefly, then coerce display status back to `idle`.
 * Source `pending` / `idle` always win immediately (cancels any outstanding timer).
 *
 * This only changes **display** status. Upstream may still be `"success"` while
 * we return `"idle"` (e.g. sticky `fetcher.data.ok`). Any later flip to
 * `"pending"` then back to `"success"` starts a new timer/`success` flash —
 * usually a bug in how `isTransitionPending` is wired (see getFetcherStatus),
 * not in this hook.
 */
const useAutoIdleStatus = (
  status: Status,
  options: UseAutoIdleStatusOptions = {}
): Status => {
  const {
    successMs = STATUS_SUCCESS_IDLE_MS,
    errorMs = STATUS_ERROR_IDLE_MS,
    reset = DEFAULT_RESET,
  } = options;

  const [settledIdle, setSettledIdle] = useState(false);
  const [prevStatus, setPrevStatus] = useState(status);

  // Reset coerced idle when the source status changes — during render, not in
  // an effect, so we avoid a cascading render that blocks React Compiler.
  if (status !== prevStatus) {
    setPrevStatus(status);
    setSettledIdle(false);
  }

  useEffect(() => {
    if (status === "pending" || status === "idle") {
      return;
    }

    if (!reset.includes(status)) {
      return;
    }

    const delayMs = status === "success" ? successMs : errorMs;
    const timeoutId = window.setTimeout(() => {
      setSettledIdle(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status, successMs, errorMs, reset]);

  if (settledIdle && (status === "success" || status === "error")) {
    return "idle";
  }

  return status;
};

export { useAutoIdleStatus };
