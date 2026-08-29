import { differenceInDays } from "date-fns";
import type { Maybe } from "~/types";

const NO_ELAPSED_DAYS = 0 as const;

/**
 * Inclusive day span from SQL `MIN`/`MAX` createdAt (or any first/last pair).
 */
export const elapsedDaysFromRange = (
  firstAt: Maybe<Date>,
  lastAt: Maybe<Date>
) => {
  if (!(firstAt && lastAt)) {
    return NO_ELAPSED_DAYS;
  }

  return differenceInDays(lastAt, firstAt) + 1;
};

/**
 * THIS LOGIC SHOULD BE RECONSIDERED
 * formatDuration({ days: 0 }, { zero: true }); // "0 days"
 */

const SINGULAR_DAY_COUNT = 1;

export const formatElapsedDaysLabel = (days: number) =>
  days === SINGULAR_DAY_COUNT ? "1 day" : `${days} days`;

export const rentDurationLabel = (from: Maybe<Date>, to: Maybe<Date>) =>
  formatElapsedDaysLabel(elapsedDaysFromRange(from, to));
