import type { Decimal } from "~/generated/prisma/internal/prismaNamespace";
import { Card, CardContent } from "./ui/card";
import { displayPrice } from "~/lib/displayPrice";

type IncomeProps = {
  id: string;
  amount: number | Decimal | null | undefined;
  rentedAt: Date;
};

export default function Income({ amount, rentedAt }: IncomeProps) {
  return (
    <Card>
      <CardContent>
        <p className="flex justify-between">
          <span>{displayPrice(amount)} </span>
          <span>
            {rentedAt && !Number.isNaN(rentedAt)
              ? rentedAt.toLocaleString()
              : "unknown"}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
