import { css, cx } from "styled-system/css";
import { Transaction } from "./transaction";
import { transactionDetailText } from "./transaction-recipe";
import type { RentalTransactionProps } from "./transaction-types";

interface RentalTransactionDetailsProps {
  rentDuration: string;
  rentName: string;
}

const rentalDetail = cx(
  transactionDetailText,
  css({ color: "foreground", fontWeight: "medium" })
);

const RentalTransactionDetails = ({
  rentDuration,
  rentName,
}: RentalTransactionDetailsProps) => (
  <p className={rentalDetail}>
    {rentName}
    <span
      className={css({
        color: "muted.foreground",
        fontWeight: "normal",
      })}
    >
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
