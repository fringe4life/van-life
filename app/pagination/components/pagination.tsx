import {
  startTransition as startReactTransition,
  type TransitionStartFunction,
  ViewTransition,
} from "react";
import { css, cx } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { PaginationControl } from "~/pagination/components/pagination-control";
import { PaginationLimitControl } from "~/pagination/components/pagination-limit-control";
import type { InitialPaginationProps } from "~/pagination/types";
import type { Id, List, Prettify } from "~/types";

function hasLoadedPaginationItems<T>(items: List<T>): items is [T, ...T[]] {
  return Boolean(items && items.length > 0);
}

type PaginationProps<T> = Prettify<
  InitialPaginationProps<T> & {
    startTransition?: TransitionStartFunction;
  }
>;

export const Pagination = <T extends Id>({
  items,
  paginationMetadata,
  startTransition = startReactTransition,
}: PaginationProps<T>) => {
  if (!hasLoadedPaginationItems(items)) {
    return <div aria-hidden="true" />;
  }

  return (
    <ViewTransition default="none" name="pagination" share="auto">
      <div
        className={cx(
          hstack({
            gap: "4",
            justifyContent: "space-between",
          }),
          css({ marginBlock: "6" })
        )}
      >
        <PaginationLimitControl startTransition={startTransition} />
        <PaginationControl
          items={items}
          paginationMetadata={paginationMetadata}
          startTransition={startTransition}
        />
      </div>
    </ViewTransition>
  );
};
