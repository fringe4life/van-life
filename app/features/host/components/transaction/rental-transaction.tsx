import { css } from "styled-system/css";
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
  <p
    className={css({
      color: "foreground",
      fontSize: "sm",
      fontWeight: "semibold",
    })}
  >
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
