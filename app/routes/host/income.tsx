import { data } from "react-router";
import { DeferredPaginated } from "~/components/deferred-paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { TransactionModel } from "~/db/client.server";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import { Income } from "~/features/host/components/income";
import { IncomeListSkeleton } from "~/features/host/components/income-list-skeleton";
import { loadIncomePage } from "~/features/host/services/income.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
import type { Route } from "./+types/income";

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
  item: Pick<TransactionModel, "amount" | "createdAt" | "id">
) => item;

const HostIncome = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, elapsedDays, pagePromise, sumIncome, txnCount } =
    loaderData;

  return (
    <PendingUI
      as="section"
      className="grid grid-rows-[min-content_min-content_min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
    >
      <title>Your Income | Van Life</title>
      <meta
        content="View your income from van rentals and track earnings"
        name="description"
      />
      <VanHeader>Income</VanHeader>

      <p>
        Last{" "}
        <span className="font-bold text-neutral-600 underline">
          {elapsedDays} days
        </span>
      </p>
      <p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
        {displayPrice(sumIncome)}
      </p>
      {/*
        Option: defer chart like the list — return chartPromise from loader (don't await),
        wrap with DeferredAwait + BarChartSkeleton fallback, then LazyBarChart inside.
        Unblocks TTFB when aggregation is slow; list defer alone already feels fast.
      */}
      <LazyBarChart
        data={chartData}
        emptyStateMessage="No income yet"
        errorStateMessage="Something went wrong"
      />
      <Sortable itemCount={txnCount} title="Income Transactions" />
      <DeferredPaginated
        as="div"
        Component={Income}
        className="grid-max v-host-list mt-6"
        emptyStateMessage="Rent some vans and your income will appear here."
        errorStateMessage="Something went wrong"
        fallback={<IncomeListSkeleton />}
        renderProps={renderIncomeItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostIncome;
