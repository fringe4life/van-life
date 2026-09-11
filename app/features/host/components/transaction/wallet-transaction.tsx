import { css } from "styled-system/css";
import { getChartHeightBand } from "~/features/host/utils/chart-height-bands";
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

interface WalletTransactionComponentProps extends WalletTransactionProps {
  chartMagnitudeMax: number;
}

const WalletTransaction = ({
  amount,
  chartMagnitudeMax,
  createdAt,
  id,
  type,
}: WalletTransactionComponentProps) => (
  <Transaction
    amount={amount}
    createdAt={createdAt}
    heightBand={getChartHeightBand(amount, chartMagnitudeMax).variant}
    id={id}
    type={type}
  >
    <WalletTransactionDetails />
  </Transaction>
);

export { WalletTransaction };
