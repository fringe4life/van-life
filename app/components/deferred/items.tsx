import type { ElementType, ReactNode } from "react";
import {
  CollectionList,
  type CollectionListProps,
} from "~/components/collection-list";
import type { Id, List, Prettify } from "~/types";
import { DeferredAwait } from "./await";

export type DeferredItemsProps<
  T extends Id,
  P,
  E extends ElementType = "div",
> = Prettify<
  Omit<CollectionListProps<T, P, E>, "items"> & {
    errorElement?: ReactNode;
    fallback: ReactNode;
    resolve: Promise<List<T>>;
  }
>;

/**
 * Deferred list: Suspense/Await → {@link CollectionList}.
 */
const DeferredItems = <T extends Id, P, E extends ElementType = "div">({
  errorElement,
  fallback,
  resolve,
  ...collectionProps
}: DeferredItemsProps<T, P, E>) => (
  <DeferredAwait
    errorElement={errorElement}
    fallback={fallback}
    resolve={resolve}
  >
    {(items) => <CollectionList {...collectionProps} items={items} />}
  </DeferredAwait>
);

export { DeferredItems };
