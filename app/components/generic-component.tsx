import type React from "react";
import type { Items } from "~/features/pagination/types";
import type { Id, Prettify } from "~/types";
import { getCollectionState } from "~/utils/get-collection-state";
import type { AsProps, EmptyState, ErrorState } from "./types";
import { UnsuccesfulState } from "./unsuccesful-state";

export type GenericComponentProps<
  T extends Id,
  P,
  E extends React.ElementType = "div",
> = Prettify<
  EmptyState &
    ErrorState &
    Items<T> &
    AsProps<E> & {
      Component: React.ComponentType<P>;
      className?: string;
      renderProps: (item: T, index: number) => P;
      wrapperProps?: React.ComponentPropsWithoutRef<E>;
    }
>;

const GenericComponent = <
  T extends Id,
  P,
  E extends React.ElementType = "div",
>({
  Component,
  items,
  renderProps,
  className = "",
  emptyStateMessage,
  errorStateMessage,
  as,
  wrapperProps,
}: GenericComponentProps<T, P, E>) => {
  const collectionState = getCollectionState(items, {
    emptyStateMessage,
    errorStateMessage,
  });

  if (collectionState.kind !== "ok") {
    return (
      <UnsuccesfulState
        isError={collectionState.kind === "error"}
        message={collectionState.message}
      />
    );
  }

  const Wrapper = as || "div";
  return (
    <Wrapper className={className} {...wrapperProps}>
      {collectionState.items.map((item, index) => (
        <Component key={item.id} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export { GenericComponent };
