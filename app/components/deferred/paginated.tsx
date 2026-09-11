import type { ElementType, ReactNode } from "react";
import {
  CollectionList,
  type CollectionListProps,
} from "~/components/collection-list";
import { Pagination } from "~/pagination/components/pagination";
import {
  PaginationOffsetTransition,
  PaginationPageSlice,
} from "~/pagination/components/pagination-offset-transition";
import type { InitialPaginationProps } from "~/pagination/types";
import { pageSliceKey } from "~/pagination/utils/page-slice-key";
import type { Id, Prettify } from "~/types";
import { DeferredAwait } from "./await";

export type DeferredPaginatedProps<
  T extends Id,
  P,
  E extends ElementType = "div",
> = Prettify<
  Omit<CollectionListProps<T, P, E>, "items"> & {
    errorElement?: ReactNode;
    fallback: ReactNode;
    resolve: Promise<InitialPaginationProps<T>>;
  }
>;

/**
 * Deferred page slice: Suspense/Await → {@link CollectionList} + {@link Pagination}.
 */
const DeferredPaginated = <T extends Id, P, E extends ElementType = "div">({
  errorElement,
  fallback,
  resolve,
  ...collectionProps
}: DeferredPaginatedProps<T, P, E>) => (
  <PaginationOffsetTransition>
    <DeferredAwait
      errorElement={errorElement}
      fallback={fallback}
      resolve={resolve}
    >
      {({ items, paginationMetadata }) => (
        <PaginationPageSlice sliceKey={pageSliceKey(items)}>
          <CollectionList {...collectionProps} items={items} />
          <Pagination items={items} paginationMetadata={paginationMetadata} />
        </PaginationPageSlice>
      )}
    </DeferredAwait>
  </PaginationOffsetTransition>
);

export { DeferredPaginated };
