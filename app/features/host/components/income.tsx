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
        <span>{createdAt?.toDateString() ?? "unknown"}</span>
      </p>
    </CardContent>
  </Card>
);

export default Income;
