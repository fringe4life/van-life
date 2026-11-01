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
import { RentalTransaction } from "~/features/host/components/transaction/rental-transaction";
import { TransactionListSkeleton } from "~/features/host/components/transaction/transaction-list-skeleton";
import type { RentalTransactionProps } from "~/features/host/components/transaction/transaction-types";
import { moneyLabels } from "~/features/host/utils/money-labels";
import { VanHeader } from "~/features/vans/components/van-header";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { gridMax } from "~/styles";
import type { Route } from "./+types/rental-activity";
export const headers = forwardDataHeaders;

const { inflow: rentalInflow, outflow: rentalOutflow } = moneyLabels.rental;

/** Items already match the card props now that the chart band is gone. */
const toRentalTransactionProps = (item: RentalTransactionProps) => item;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  /**
   * Workaround: these `.server` modules are imported here, not at the top of the
   * module, because a static import survives React Router's client export removal
   * and then trips its `.server` resolver — the route's client bundle never loads
   * and the page never hydrates.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200 and the page
   * hydrates. The framework docs allow a loader to import `.server` files.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [{ loadHostSearchParams, parsePaginationCursor }, { loadIncomePage }] =
    await Promise.all([
      import("~/pagination/loaders.server"),
      import("~/features/host/services/income.server"),
    ]);

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

const HostRentalActivity = ({ loaderData }: Route.ComponentProps) => {
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
      <title>Rental Activity | Van Life</title>
      <meta
        content="Rental payments received and sent for completed rentals"
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
        <VanHeader>Rental activity</VanHeader>

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
          inflowLabel={rentalInflow.ledger}
          net={timeline.netTotal}
          netLabel={moneyLabels.rental.net}
          outflow={timeline.outflowTotal}
          outflowLabel={rentalOutflow.ledger}
        />
      ) : null}

      <LazyMoneyTimeline
        data={timeline}
        emptyState={{ title: moneyLabels.rental.empty }}
        errorState={{ title: "Something went wrong" }}
        inflowLabel={rentalInflow.ledger}
        noMatchState={null}
        outflowLabel={rentalOutflow.ledger}
      />

      <Sortable
        className={css({ marginBlockStart: "5" })}
        itemCount={txnCount}
        title="Rental activity"
      />
      <DeferredPaginated
        as="div"
        Component={RentalTransaction}
        className={cx(gridMax, css({ marginBlockStart: "6" }))}
        emptyState={{
          description: "Complete a rental and its payments will appear here.",
          title: "No rental payments yet",
        }}
        errorState={{ title: "Something went wrong" }}
        fallback={<TransactionListSkeleton />}
        noMatchState={null}
        renderProps={toRentalTransactionProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostRentalActivity;
