import { css, cx } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { PaginationControl } from "~/features/pagination/components/pagination-control";
import { PaginationLimitControl } from "~/features/pagination/components/pagination-limit-control";
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
    return <div aria-hidden="true" />;
  }

  return (
    <div
      className={cx(
        hstack({
          gap: "4",
          justifyContent: "space-between",
        }),
        css({ marginBlock: "6" })
      )}
    >
      <PaginationLimitControl />
      <PaginationControl
        items={items}
        paginationMetadata={paginationMetadata}
      />
    </div>
  );
};
