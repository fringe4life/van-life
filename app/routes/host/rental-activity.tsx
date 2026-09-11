import { ViewTransition } from "react";
import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { DeferredPaginated } from "~/components/deferred/paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import { RentalTransaction } from "~/features/host/components/transaction/rental-transaction";
import { TransactionListSkeleton } from "~/features/host/components/transaction/transaction-list-skeleton";
import type { RentalTransactionProps } from "~/features/host/components/transaction/transaction-types";
import { loadIncomePage } from "~/features/host/services/income.server";
import { getChartMagnitudeMax } from "~/features/host/utils/chart-height-bands";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/pagination/loaders.server";
import { gridMax } from "~/styles";
import type { Route } from "./+types/rental-activity";
export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const { cursor, limit, direction, sort } = loadHostSearchParams(request);
  const page = await loadIncomePage(db, user.id, {
    cursor: parsePaginationCursor(cursor),
    direction,
    limit,
    sort,
  });

  return data(page, { headers: PRIVATE_NO_STORE_HEADERS });
};

const renderIncomeItemProps = (
  item: RentalTransactionProps,
  chartMagnitudeMax: number
) => ({
  ...item,
  chartMagnitudeMax,
});

const HostRentalActivity = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, elapsedDays, pagePromise, sumIncome, txnCount } =
    loaderData;
  const chartMagnitudeMax = getChartMagnitudeMax(chartData);
  const renderRentalTransactionProps = (item: RentalTransactionProps) =>
    renderIncomeItemProps(item, chartMagnitudeMax);

  return (
    <PendingUI
      as="section"
      className={grid({
        contain: "content",
        gap: "0",
        gridTemplateRows:
          // biome-ignore assist/source/noDuplicateClasses: css styles
          "repeat(3, min-content) var(--chart-height) min-content 1fr min-content",
      })}
    >
      <title>Rental Activity | Van Life</title>
      <meta
        content="View rental payments and adjustments from completed rentals"
        name="description"
      />
      <VanHeader>Rental activity</VanHeader>

      <ViewTransition
        {...viewTransitionShare}
        name={chromeViewTransitionName.elapsedDays}
      >
        <p
          className={css({
            marginBlock: "3",
          })}
        >
          Rental activity, last{" "}
          <span
            className={css({
              color: "muted.foreground",
              fontWeight: "bold",
              textDecoration: "underline",
            })}
          >
            {elapsedDays} days
          </span>
        </p>
      </ViewTransition>
      <ViewTransition
        {...viewTransitionShare}
        name={chromeViewTransitionName.incomeAmount}
      >
        <p
          className={css({
            fontSize: { base: "3xl", md: "5xl", sm: "4xl" },
            fontWeight: "extrabold",
            marginBlockEnd: "6",
          })}
        >
          {displayPrice(sumIncome)}
        </p>
      </ViewTransition>

      {/*
        Option: defer chart like the list — return chartPromise from loader (don't await),
        wrap with DeferredAwait + BarChartSkeleton fallback, then LazyBarChart inside.
        Unblocks TTFB when aggregation is slow; list defer alone already feels fast.
      */}
      <LazyBarChart
        data={chartData}
        emptyState={{ title: "No rental earnings yet" }}
        errorState={{ title: "Something went wrong" }}
        noMatchState={null}
      />
      <Sortable itemCount={txnCount} title="Rental activity" />
      <DeferredPaginated
        as="div"
        Component={RentalTransaction}
        className={cx(gridMax, css({ marginBlockStart: "6" }))}
        emptyState={{
          description:
            "Complete a rental and its payment activity will appear here.",
          title: "No rental earnings yet",
        }}
        errorState={{ title: "Something went wrong" }}
        fallback={<TransactionListSkeleton />}
        noMatchState={null}
        renderProps={renderRentalTransactionProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostRentalActivity;
