import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { DeferredPaginated } from "~/components/deferred/paginated";
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
      className={grid({
        contain: "content",
        gap: "0",
        gridTemplateRows:
          // biome-ignore assist/source/noDuplicateClasses: grid definition
          "repeat(3, min-content) var(--chart-height) min-content 1fr min-content",
      })}
    >
      <title>Your Wallet | Van Life</title>
      <meta
        content="View deposits and withdrawals that change your wallet balance"
        name="description"
      />
      <VanHeader>Wallet</VanHeader>

      <p
        className={css({
          marginBlock: "3",
          viewTransitionName: "elapsed-days",
        })}
      >
        Wallet movements, last{" "}
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
          viewTransitionName: "balance-amount",
        })}
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
        emptyState={{ title: "No wallet movements yet" }}
        errorState={{ title: "Something went wrong" }}
        noMatchState={null}
      />
      <Sortable itemCount={txnCount} title="Wallet movements" />
      <DeferredPaginated
        as="div"
        Component={WalletTransaction}
        className={cx(gridMax, vHostList, css({ marginBlockStart: "6" }))}
        emptyState={{
          description:
            "Add or withdraw funds and your wallet movements will appear here.",
          title: "No wallet movements yet",
        }}
        errorState={{ title: "Something went wrong" }}
        fallback={<TransactionListSkeleton />}
        noMatchState={null}
        renderProps={renderTransferItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostWalletActivity;
