import type React from "react";
import { OutcomeState } from "~/components/outcome-state";
import type { Items } from "~/features/pagination/types";
import type { Id, Prettify } from "~/types";
import { getCollectionState } from "~/utils/errors/get-collection-state";
import type { AsProps, CollectionOutcomeProps } from "./types";

export type GenericComponentProps<
  T extends Id,
  P,
  E extends React.ElementType = "div",
> = Prettify<
  CollectionOutcomeProps &
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
  emptyState,
  errorState,
  noMatchState,
  noMatchWhen,
  as,
  wrapperProps,
}: GenericComponentProps<T, P, E>) => {
  const collectionState = getCollectionState(items, {
    emptyState,
    errorState,
    noMatchState,
    noMatchWhen,
  });

  if (!collectionState.ok) {
    if (!collectionState.config) {
      return <div aria-hidden="true" />;
    }

    return (
      <OutcomeState kind={collectionState.kind} {...collectionState.config} />
    );
  }

  const Wrapper = as || "div";
  return (
    <Wrapper className={className} {...wrapperProps}>
      {collectionState.data.map((item, index) => (
        <Component key={item.id} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export { GenericComponent };
