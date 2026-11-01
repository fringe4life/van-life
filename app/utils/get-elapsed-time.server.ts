import type { Maybe } from "~/types";

const NO_ELAPSED_DAYS = 0 as const;

const MS_PER_DAY = 86_400_000;

/**
 * UTC calendar-day index. Whole-day arithmetic on the UTC date keeps DST out of
 * the span. date-fns `differenceInDays` measured local full-day periods instead;
 * this is the UTC calendar behaviour the app wants after that dependency left.
 */
const utcDayIndex = (date: Date): number =>
  Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      MS_PER_DAY
  );

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

  return utcDayIndex(lastAt) - utcDayIndex(firstAt) + 1;
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
