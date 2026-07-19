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
