import { css, cx } from "styled-system/css";
import { TransactionType } from "~/db/enums";
import { Transaction } from "./transaction";
import { transactionDetailText } from "./transaction-recipe";
import type {
  WalletTransactionProps,
  WalletTransactionType,
} from "./transaction-types";

/**
 * The title already names the movement (Deposit / Withdrawal), so the detail line
 * carries its effect on the balance, stated in the direction of the movement:
 * money leaves the balance on a withdrawal and lands on it with a deposit.
 * Vocabulary: #403. Short enough to stay on one line in the narrow column.
 */
const walletEffectByType = {
  [TransactionType.DEPOSIT]: "To your balance",
  [TransactionType.WITHDRAW]: "From your balance",
} as const satisfies Record<WalletTransactionType, string>;

const walletDetail = cx(
  transactionDetailText,
  css({ color: "muted.foreground" })
);

const WalletTransactionDetails = ({
  type,
}: {
  type: WalletTransactionType;
}) => <p className={walletDetail}>{walletEffectByType[type]}</p>;

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
