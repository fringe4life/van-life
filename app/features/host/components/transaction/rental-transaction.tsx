import { Transaction } from "./transaction";
import type { RentalTransactionProps } from "./transaction-types";

interface RentalTransactionDetailsProps {
  rentDuration: string;
  rentName: string;
}

const RentalTransactionDetails = ({
  rentDuration,
  rentName,
}: RentalTransactionDetailsProps) => (
  <p className="font-semibold text-foreground text-sm">
    {rentName}
    <span className="font-normal text-muted-foreground">
      {` · ${rentDuration}`}
    </span>
  </p>
);

const RentalTransaction = ({
  amount,
  createdAt,
  id,
  rentDuration,
  rentName,
  type,
}: RentalTransactionProps) => (
  <Transaction amount={amount} createdAt={createdAt} id={id} type={type}>
    <RentalTransactionDetails rentDuration={rentDuration} rentName={rentName} />
  </Transaction>
);

export { RentalTransaction };
