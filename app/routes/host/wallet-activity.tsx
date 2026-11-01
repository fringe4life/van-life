import { ViewTransition } from "react";
import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, flex, grid } from "styled-system/patterns";
import { DeferredPaginated } from "~/components/deferred/paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { LazyMoneyTimeline } from "~/features/host/components/money-timeline/lazy-money-timeline";
import { MoneyLedger } from "~/features/host/components/money-timeline/money-ledger";
import { TransactionListSkeleton } from "~/features/host/components/transaction/transaction-list-skeleton";
import type { WalletTransactionProps } from "~/features/host/components/transaction/transaction-types";
import { WalletTransaction } from "~/features/host/components/transaction/wallet-transaction";
import { moneyLabels } from "~/features/host/utils/money-labels";
import { VanHeader } from "~/features/vans/components/van-header";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { gridMax } from "~/styles";
import type { Route } from "./+types/wallet-activity";

export const headers = forwardDataHeaders;

const { inflow: walletInflow, outflow: walletOutflow } = moneyLabels.wallet;

/** Items already match the card props now that the chart band is gone. */
const toWalletTransactionProps = (item: WalletTransactionProps) => item;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  /**
   * Workaround: these `.server` modules are imported here, not at the top of the
   * module, because a static import survives React Router's client export removal
   * and then trips its `.server` resolver. See `app/routes/host/rental-activity.tsx`
   * for the full note.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [
    { loadHostSearchParams, parsePaginationCursor },
    { loadTransfersPage },
  ] = await Promise.all([
    import("~/pagination/loaders.server"),
    import("~/features/host/services/transfers.server"),
  ]);

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

const HostWalletActivity = ({ loaderData }: Route.ComponentProps) => {
  const { pagePromise, timeline, txnCount } = loaderData;

  return (
    <PendingUI
      as="section"
      className={cx(
        cq({ name: "activity" }),
        grid({
          contain: "content",
          gap: "0",
          gridTemplateRows: "repeat(4, min-content) 1fr",
        })
      )}
    >
      <title>Your Wallet | Van Life</title>
      <meta
        content="Deposits and withdrawals that change your wallet balance"
        name="description"
      />
      <div
        className={flex({
          alignItems: "center",
          flexWrap: "wrap",
          gap: "3",
          justifyContent: "space-between",
        })}
      >
        <VanHeader>Wallet</VanHeader>

        <ViewTransition
          {...viewTransitionShare}
          name={chromeViewTransitionName.hostRange}
        >
          <p
            className={css({
              color: "muted.foreground",
              fontSize: "sm",
              fontVariantNumeric: "tabular-nums",
              margin: "0",
            })}
          >
            {timeline?.rangeLabel}
          </p>
        </ViewTransition>
      </div>

      {timeline ? (
        <MoneyLedger
          inflow={timeline.inflowTotal}
          inflowLabel={walletInflow.ledger}
          net={timeline.netTotal}
          netLabel={moneyLabels.wallet.net}
          outflow={timeline.outflowTotal}
          outflowLabel={walletOutflow.ledger}
        />
      ) : null}

      <LazyMoneyTimeline
        data={timeline}
        emptyState={{ title: moneyLabels.wallet.empty }}
        errorState={{ title: "Something went wrong" }}
        inflowLabel={walletInflow.ledger}
        noMatchState={null}
        outflowLabel={walletOutflow.ledger}
      />

      <Sortable
        className={css({ marginBlockStart: "5" })}
        itemCount={txnCount}
        title="Wallet"
      />
      <DeferredPaginated
        as="div"
        Component={WalletTransaction}
        className={cx(gridMax, css({ marginBlockStart: "6" }))}
        emptyState={{
          description:
            "Deposit or withdraw and those entries will appear here.",
          title: "No deposits or withdrawals yet",
        }}
        errorState={{ title: "Something went wrong" }}
        fallback={<TransactionListSkeleton />}
        noMatchState={null}
        renderProps={toWalletTransactionProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostWalletActivity;
