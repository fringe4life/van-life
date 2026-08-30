import { TransactionSkeleton } from "~/features/host/components/transaction/transaction-skeleton";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";

const TransactionListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={TransactionSkeleton}
    className="grid-max v-host-list mt-6"
  />
);

export { TransactionListSkeleton };
