import { css } from "styled-system/css";
import { Transaction } from "./transaction";
import type { WalletTransactionProps } from "./transaction-types";

const WalletTransactionDetails = () => (
  <p
    className={css({
      color: "foreground",
      fontSize: "sm",
      fontWeight: "semibold",
    })}
  >
    Wallet movement
  </p>
);

const WalletTransaction = ({
  amount,
  createdAt,
  id,
  type,
}: WalletTransactionProps) => (
  <Transaction amount={amount} createdAt={createdAt} id={id} type={type}>
    <WalletTransactionDetails />
  </Transaction>
);

export { WalletTransaction };
