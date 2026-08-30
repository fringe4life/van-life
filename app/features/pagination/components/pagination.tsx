import { PaginationControl } from "~/features/pagination/components/pagination-control";
import { PaginationLimitControl } from "~/features/pagination/components/pagination-limit-control";
import { PaginationUnsuccessful } from "~/features/pagination/components/pagination-unsuccessful";
import type { InitialPaginationProps } from "~/features/pagination/types";
import type { Id, List } from "~/types";

function hasLoadedPaginationItems<T>(items: List<T>): items is [T, ...T[]] {
  return Boolean(items && items.length > 0);
}

export const Pagination = <T extends Id>({
  items,
  paginationMetadata,
}: InitialPaginationProps<T>) => {
  if (!hasLoadedPaginationItems(items)) {
    return <PaginationUnsuccessful />;
  }

  return (
    <div className="my-6 flex items-center justify-between gap-4">
      <PaginationLimitControl />
      <PaginationControl
        items={items}
        paginationMetadata={paginationMetadata}
      />
    </div>
  );
};
