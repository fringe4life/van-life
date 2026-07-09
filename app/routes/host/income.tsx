import { data } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import Income from "~/features/host/components/income";
import { loadIncomePage } from "~/features/host/services/income.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { Pagination } from "~/features/pagination/components/pagination";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
import type { Id } from "~/types";
import { calculateTotalIncome } from "~/utils/calculate-income";
import { getElapsedTime } from "~/utils/get-elapsed-time";
import type { Route } from "./+types/income";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  // Parse search parameters for pagination and sorting
  const { cursor, limit, direction, sort } = loadHostSearchParams(request);
  const page = await loadIncomePage(db, user.id, {
    cursor: parsePaginationCursor(cursor),
    direction,
    limit,
    sort,
  });

  return data(page, {
    headers: {
      "Cache-Control": "max-age=259200",
    },
  });
};
const renderIncomeItemProps = <T extends Id>(item: T) => item;

const HostIncome = ({ loaderData }: Route.ComponentProps) => {
  const {
    chartData,
    items: paginatedTransactions,
    paginationMetadata,
  } = loaderData;

  // Calculate income and elapsed time from chart data (all transactions)
  const sumIncome = calculateTotalIncome(chartData);
  const elapsedTime = getElapsedTime(chartData);

  const mappedData = chartData?.map((income) => ({
    amount: Math.round(income.amount),
    name: income.createdAt.toDateString(),
  }));

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
          {elapsedTime.elapsedDays} days
        </span>
      </p>
      <p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
        {displayPrice(sumIncome)}
      </p>
      <LazyBarChart
        data={mappedData}
        emptyStateMessage="No income yet"
        errorStateMessage="Something went wrong"
      />
      <Sortable itemCount={chartData?.length} title="Income Transactions" />
      <GenericComponent
        as="div"
        Component={Income}
        className="grid-max mt-6"
        emptyStateMessage="Rent some vans and your income will appear here."
        errorStateMessage="Something went wrong"
        items={paginatedTransactions}
        renderProps={renderIncomeItemProps}
      />
      <Pagination
        items={paginatedTransactions}
        paginationMetadata={paginationMetadata}
      />
    </PendingUI>
  );
};
export default HostIncome;
