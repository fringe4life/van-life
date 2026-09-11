import { css } from "styled-system/css";
import { getChartHeightBand } from "~/features/host/utils/chart-height-bands";
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

interface RentalTransactionComponentProps extends RentalTransactionProps {
  chartMagnitudeMax: number;
}

const RentalTransaction = ({
  amount,
  chartMagnitudeMax,
  createdAt,
  id,
  rentDuration,
  rentName,
  type,
}: RentalTransactionComponentProps) => (
  <Transaction
    amount={amount}
    createdAt={createdAt}
    heightBand={getChartHeightBand(amount, chartMagnitudeMax).variant}
    id={id}
    type={type}
  >
    <RentalTransactionDetails rentDuration={rentDuration} rentName={rentName} />
  </Transaction>
);

export { RentalTransaction };
