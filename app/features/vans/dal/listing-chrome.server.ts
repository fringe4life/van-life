import { getColumns, gt, sql } from "drizzle-orm";
import { SIX_MONTHS } from "~/constants/time-constants";
import { VanState } from "~/db/enums";
import { van } from "~/db/schema/van";
import { ListingChrome } from "~/features/vans/types";

function newnessCutoffUtc(now = new Date()): Date {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() - SIX_MONTHS;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return new Date(
    Date.UTC(
      year,
      month,
      Math.min(now.getUTCDate(), lastDay),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  );
}

function listingChromeFromRow(
  state: VanState | null,
  createdAt: Date,
  cutoff = newnessCutoffUtc()
): ListingChrome {
  if (state === VanState.IN_REPAIR || state === VanState.ON_SALE) {
    return state;
  }
  if (createdAt > cutoff) {
    return ListingChrome.NEW;
  }
  return VanState.AVAILABLE;
}

function listingChromeSql(cutoff: Date) {
  return sql<ListingChrome>`CASE
    WHEN ${van.state} = ${VanState.IN_REPAIR} THEN ${van.state}
    WHEN ${van.state} = ${VanState.ON_SALE} THEN ${van.state}
    WHEN ${gt(van.createdAt, cutoff)} THEN ${ListingChrome.NEW}
    ELSE ${VanState.AVAILABLE}
  END`.as("listingChrome");
}

function vanSelectWithChrome(now = new Date()) {
  return {
    ...getColumns(van),
    listingChrome: listingChromeSql(newnessCutoffUtc(now)),
  };
}

export { listingChromeFromRow, newnessCutoffUtc, vanSelectWithChrome };
