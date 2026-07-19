import type { ElementType, ReactNode } from "react";
import { DeferredAwait } from "~/components/deferred-await";
import {
  GenericComponent,
  type GenericComponentProps,
} from "~/components/generic-component";
import { Pagination } from "~/features/pagination/components/pagination";
import type { PaginationProps } from "~/features/pagination/types";
import type { Id, Prettify } from "~/types";

export type DeferredPaginatedProps<
  T extends Id,
  P,
  E extends ElementType = "div",
> = Prettify<
  Omit<GenericComponentProps<T, P, E>, "items"> & {
    errorElement?: ReactNode;
    fallback: ReactNode;
    resolve: Promise<PaginationProps<T>>;
  }
>;

/**
 * Deferred page slice: Suspense/Await → list + {@link Pagination}.
 */
const DeferredPaginated = <T extends Id, P, E extends ElementType = "div">({
  errorElement,
  fallback,
  resolve,
  ...genericProps
}: DeferredPaginatedProps<T, P, E>) => (
  <DeferredAwait
    errorElement={errorElement}
    fallback={fallback}
    resolve={resolve}
  >
    {({ items, paginationMetadata }) => (
      <>
        <GenericComponent {...genericProps} items={items} />
        <Pagination items={items} paginationMetadata={paginationMetadata} />
      </>
    )}
  </DeferredAwait>
);

export { DeferredPaginated };
