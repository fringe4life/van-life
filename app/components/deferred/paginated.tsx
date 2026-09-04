import type { ElementType, ReactNode } from "react";
import {
  CollectionList,
  type CollectionListProps,
} from "~/components/collection-list";
import { Pagination } from "~/features/pagination/components/pagination";
import type { InitialPaginationProps } from "~/features/pagination/types";
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
  <DeferredAwait
    errorElement={errorElement}
    fallback={fallback}
    resolve={resolve}
  >
    {({ items, paginationMetadata }) => (
      <>
        <CollectionList {...collectionProps} items={items} />
        <Pagination items={items} paginationMetadata={paginationMetadata} />
      </>
    )}
  </DeferredAwait>
);

export { DeferredPaginated };
