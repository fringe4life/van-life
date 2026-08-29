import { data } from "react-router";
import { DeferredPaginated } from "~/components/deferred-paginated";
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
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
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
      className="grid grid-rows-[min-content_min-content_min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
    >
      <title>Rental Activity | Van Life</title>
      <meta
        content="View rental payments and adjustments from completed rentals"
        name="description"
      />
      <VanHeader>Rental activity</VanHeader>

      <p className="my-3" style={{ viewTransitionName: "elapsed-days" }}>
        Rental activity, last{" "}
        <span className="font-bold text-muted-foreground underline">
          {elapsedDays} days
        </span>
      </p>
      <p
        className="mb-6 font-extrabold text-3xl sm:text-4xl md:text-5xl"
        style={{ viewTransitionName: "income-amount" }}
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
        emptyStateMessage="No rental earnings yet"
        errorStateMessage="Something went wrong"
      />
      <Sortable itemCount={txnCount} title="Rental activity" />
      <DeferredPaginated
        as="div"
        Component={RentalTransaction}
        className="grid-max v-host-list mt-6"
        emptyStateMessage="Complete a rental and its payment activity will appear here."
        errorStateMessage="Something went wrong"
        fallback={<TransactionListSkeleton />}
        renderProps={renderIncomeItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostRentalActivity;
