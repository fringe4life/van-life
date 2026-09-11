import { css, cx } from "styled-system/css";
import { ReviewSkeleton } from "~/features/host/components/review/review-skeleton";
import { PaginatedItemsSkeleton } from "~/pagination/components/paginated-items-skeleton";
import { gridMax } from "~/styles";

const ReviewListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={ReviewSkeleton}
    className={cx(gridMax, css({ marginBlockStart: "6" }))}
  />
);

export { ReviewListSkeleton };
