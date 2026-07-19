import type { ElementType, ReactNode } from "react";
import { DeferredAwait } from "~/components/deferred-await";
import {
  GenericComponent,
  type GenericComponentProps,
} from "~/components/generic-component";
import type { Id, List, Prettify } from "~/types";

export type DeferredItemsProps<
  T extends Id,
  P,
  E extends ElementType = "div",
> = Prettify<
  Omit<GenericComponentProps<T, P, E>, "items"> & {
    errorElement?: ReactNode;
    fallback: ReactNode;
    resolve: Promise<List<T>>;
  }
>;

/**
 * Deferred list: Suspense/Await → {@link GenericComponent}.
 */
const DeferredItems = <T extends Id, P, E extends ElementType = "div">({
  errorElement,
  fallback,
  resolve,
  ...genericProps
}: DeferredItemsProps<T, P, E>) => (
  <DeferredAwait
    errorElement={errorElement}
    fallback={fallback}
    resolve={resolve}
  >
    {(items) => <GenericComponent {...genericProps} items={items} />}
  </DeferredAwait>
);

export { DeferredItems };
