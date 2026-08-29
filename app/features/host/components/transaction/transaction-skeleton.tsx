import { Card, CardContent } from "~/components/ui/card";
import { transactionCard } from "./transaction-recipe";

const TransactionSkeleton = () => (
  <div className="@container/transaction min-w-0 self-start">
    <Card aria-hidden="true" className={transactionCard()}>
      <CardContent className="contents">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2 border-border-subtle border-b pb-4">
            <div className="h-5 w-28 rounded-full bg-skeleton" />
            <div className="h-7 w-36 rounded bg-skeleton" />
          </div>
          <div className="mt-3 h-4 w-3/4 rounded bg-skeleton" />
        </div>
        <div className="grid min-w-0 @max-sm/transaction:grid-cols-1 @min-md/transaction:grid-cols-1 grid-cols-[minmax(0,1fr)_auto] items-baseline @max-sm/transaction:justify-items-start @min-md/transaction:justify-items-end gap-x-4 @min-md/transaction:gap-y-1 gap-y-2">
          <div className="h-8 w-32 rounded bg-skeleton" />
          <div className="h-4 w-28 rounded bg-skeleton" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export { TransactionSkeleton };
