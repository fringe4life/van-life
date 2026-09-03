import { ReviewSkeleton } from "~/features/host/components/review/review-skeleton";
import { PaginatedItemsSkeleton } from "~/features/pagination/components/paginated-items-skeleton";
import { gridMax } from "~/styles";
import { css, cx } from "../../../../../styled-system/css";
import { vHostList } from "../../styles";

const ReviewListSkeleton = () => (
  <PaginatedItemsSkeleton
    Component={ReviewSkeleton}
    className={cx(gridMax, vHostList, css({ marginBlockStart: "6" }))}
  />
);

export { ReviewListSkeleton };
