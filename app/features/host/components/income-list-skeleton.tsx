import { IncomeSkeleton } from "~/features/host/components/income-skeleton";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";

const IncomeListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={IncomeSkeleton}
    className="grid-max v-host-list mt-6"
  />
);

export { IncomeListSkeleton };
