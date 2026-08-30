import { data } from "react-router";
import { DeferredPaginated } from "~/components/deferred-paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import { TransactionListSkeleton } from "~/features/host/components/transaction/transaction-list-skeleton";
import type { WalletTransactionProps } from "~/features/host/components/transaction/transaction-types";
import { WalletTransaction } from "~/features/host/components/transaction/wallet-transaction";
import { loadTransfersPage } from "~/features/host/services/transfers.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { VanHeader } from "~/features/vans/components/van-header";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/lib/search-params.server";
import type { Route } from "./+types/wallet-activity";

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const { cursor, limit, direction, sort } = loadHostSearchParams(request);
  const page = await loadTransfersPage(db, user.id, {
    cursor: parsePaginationCursor(cursor),
    direction,
    limit,
    sort,
  });

  return data(page, { headers: PRIVATE_NO_STORE_HEADERS });
};

const renderTransferItemProps = (item: WalletTransactionProps) => item;

const HostWalletActivity = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, elapsedDays, pagePromise, sumAmount, txnCount } =
    loaderData;

  return (
    <PendingUI
      as="section"
      className="grid grid-rows-[min-content_min-content_min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
    >
      <title>Your Wallet | Van Life</title>
      <meta
        content="View deposits and withdrawals that change your wallet balance"
        name="description"
      />
      <VanHeader>Wallet</VanHeader>

      <p className="my-3" style={{ viewTransitionName: "elapsed-days" }}>
        Wallet movements, last{" "}
        <span className="font-bold text-muted-foreground underline">
          {elapsedDays} days
        </span>
      </p>
      <p
        className="mb-6 font-extrabold text-3xl sm:text-4xl md:text-5xl"
        style={{ viewTransitionName: "balance-amount" }}
      >
        {displayPrice(sumAmount)}
      </p>
      {/*
        Option: defer chart like the list — return chartPromise from loader (don't await),
        wrap with DeferredAwait + BarChartSkeleton fallback, then LazyBarChart inside.
        Unblocks TTFB when aggregation is slow; list defer alone already feels fast.
      */}
      <LazyBarChart
        data={chartData}
        emptyStateMessage="No wallet movements yet"
        errorStateMessage="Something went wrong"
      />
      <Sortable itemCount={txnCount} title="Wallet movements" />

      <DeferredPaginated
        as="div"
        Component={WalletTransaction}
        className="grid-max v-host-list mt-6"
        emptyStateMessage="Add or withdraw funds and your wallet movements will appear here."
        errorStateMessage="Something went wrong"
        fallback={<TransactionListSkeleton />}
        renderProps={renderTransferItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostWalletActivity;
