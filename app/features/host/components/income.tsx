import { Card, CardContent } from "~/components/ui/card";
import type { TransactionModel } from "~/db/client.server";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Prettify } from "~/types";

type IncomeProps = Prettify<
  Pick<TransactionModel, "amount" | "createdAt" | "id">
>;

const Income = ({ amount, createdAt }: IncomeProps) => (
  <Card className="contain-content">
    <CardContent>
      <p className="flex justify-between">
        <span>{displayPrice(amount)} </span>
        {/*
          Local toDateString() can differ SSR (UTC Workers) vs browser TZ → hydration mismatch.
          suppressHydrationWarning avoids Suspense-boundary client re-render cost.
          TODO: prefer UTC→viewer-TZ formatting (e.g. date-fns/tz or Intl with fixed timeZone) in loader.
        */}
        <span suppressHydrationWarning>
          {createdAt?.toDateString() ?? "unknown"}
        </span>
      </p>
    </CardContent>
  </Card>
);

export { Income };
