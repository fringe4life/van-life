import { css, cx } from "styled-system/css";
import { TransactionSkeleton } from "~/features/host/components/transaction/transaction-skeleton";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";
import { gridMax } from "~/styles";
import { vHostList } from "../../styles";

const TransactionListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={TransactionSkeleton}
    className={cx(gridMax, vHostList, css({ marginBlockStart: "6" }))}
  />
);

export { TransactionListSkeleton };
