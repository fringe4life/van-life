import { ReviewSkeleton } from "~/features/host/components/review/review-skeleton";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";

const ReviewListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={ReviewSkeleton}
    className="grid-max v-host-list mt-6"
  />
);

export { ReviewListSkeleton };
