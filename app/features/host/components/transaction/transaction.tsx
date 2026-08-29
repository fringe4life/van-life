import { Card, CardContent } from "~/components/ui/card";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Children, Prettify } from "~/types";
import { TransactionBadge } from "./transaction-badge";
import { transactionCard, transactionMeta } from "./transaction-recipe";
import type { TransactionProps } from "./transaction-types";

const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  weekday: "short",
  year: "numeric",
});

type TransactionShellProps = Prettify<Children & TransactionProps>;

const Transaction = ({
  amount,
  children,
  createdAt,
  id,
  type,
}: TransactionShellProps) => {
  const { title } = transactionMeta[type];
  const headingId = `transaction-${id}-title`;

  return (
    <div className="@container/transaction min-w-0 self-start">
      <Card
        aria-labelledby={headingId}
        className={transactionCard({ type })}
        role="article"
      >
        <CardContent className="contents">
          <div className={"min-w-0"}>
            <div className="flex min-w-0 flex-wrap items-center gap-2 border-border-subtle border-b pb-4">
              <TransactionBadge type={type} />
              <h3
                className="wrap-break-words min-w-0 font-bold text-lg tracking-tight"
                id={headingId}
              >
                {title}
              </h3>
            </div>
            <div className="mt-3 min-w-0">{children}</div>
          </div>
          <div
            className={
              "grid min-w-0 @max-sm/transaction:grid-cols-1 @min-md/transaction:grid-cols-1 grid-cols-[minmax(0,1fr)_auto] items-baseline @max-sm/transaction:justify-items-start @min-md/transaction:justify-items-end gap-x-4 @min-md/transaction:gap-y-1 gap-y-2"
            }
          >
            <p className="whitespace-nowrap font-extrabold text-2xl text-foreground lining-nums tabular-nums tracking-tighter">
              <span className="sr-only">Transaction amount: </span>
              {displayPrice(amount)}
            </p>
            <time
              className="whitespace-nowrap text-muted-foreground text-sm"
              dateTime={createdAt.toISOString()}
              suppressHydrationWarning
            >
              {transactionDateFormatter.format(createdAt)}
            </time>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Transaction };
