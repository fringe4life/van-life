import { css, cx } from "styled-system/css";
import { TransactionSkeleton } from "~/features/host/components/transaction/transaction-skeleton";
import { PaginatedItemsSkeleton } from "~/pagination/components/paginated-items-skeleton";
import { gridMax } from "~/styles";

const TransactionListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={TransactionSkeleton}
    className={cx(gridMax, css({ marginBlockStart: "6" }))}
  />
);

export { TransactionListSkeleton };
