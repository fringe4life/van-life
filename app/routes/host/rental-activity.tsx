import { data } from "react-router";
import { DeferredPaginated } from "~/components/deferred/paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import { RentalTransaction } from "~/features/host/components/transaction/rental-transaction";
import { TransactionListSkeleton } from "~/features/host/components/transaction/transaction-list-skeleton";
import type { RentalTransactionProps } from "~/features/host/components/transaction/transaction-types";
import { loadIncomePage } from "~/features/host/services/income.server";
import { vHostList } from "~/features/host/styles";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/features/pagination/loaders.server";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import { gridMax } from "~/styles";
import { css, cx } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";
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

const renderIncomeItemProps = (item: RentalTransactionProps) => item;

const HostRentalActivity = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, elapsedDays, pagePromise, sumIncome, txnCount } =
    loaderData;

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

      <p
        className={css({
          marginBlock: "3",
          viewTransitionName: "elapsed-days",
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
      <p
        className={css({
          fontSize: { base: "3xl", md: "5xl", sm: "4xl" },
          fontWeight: "extrabold",
          marginBlockEnd: "6",
          viewTransitionName: "income-amount",
        })}
      >
        {displayPrice(sumIncome)}
      </p>

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
        className={cx(gridMax, vHostList, css({ marginBlockStart: "6" }))}
        emptyState={{
          description:
            "Complete a rental and its payment activity will appear here.",
          title: "No rental earnings yet",
        }}
        errorState={{ title: "Something went wrong" }}
        fallback={<TransactionListSkeleton />}
        noMatchState={null}
        renderProps={renderIncomeItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostRentalActivity;
