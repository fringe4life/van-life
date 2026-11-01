import { css } from "styled-system/css";
import { TransactionType } from "~/db/enums";
import { Transaction } from "./transaction";
import type {
  WalletTransactionProps,
  WalletTransactionType,
} from "./transaction-types";

/**
 * The title already names the movement (Deposit / Withdrawal), so the detail line
 * carries its effect on the balance. Vocabulary: #403.
 */
const walletEffectByType = {
  [TransactionType.DEPOSIT]: "Added to your balance",
  [TransactionType.WITHDRAW]: "Taken from your balance",
} as const satisfies Record<WalletTransactionType, string>;

const WalletTransactionDetails = ({
  type,
}: {
  type: WalletTransactionType;
}) => (
  <p
    className={css({
      color: "foreground",
      fontSize: "sm",
      fontWeight: "semibold",
    })}
  >
    {walletEffectByType[type]}
  </p>
);

const WalletTransaction = ({
  amount,
  createdAt,
  id,
  type,
}: WalletTransactionProps) => (
  <Transaction amount={amount} createdAt={createdAt} id={id} type={type}>
    <WalletTransactionDetails type={type} />
  </Transaction>
);

export { WalletTransaction };
