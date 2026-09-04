import type { ElementType } from "react";
import { ItemList, type ItemListProps } from "~/components/item-list";
import { OutcomeState } from "~/components/outcome-state";
import type { CollectionOutcomeProps } from "~/components/types";
import type { Items } from "~/features/pagination/types";
import type { Id, Prettify } from "~/types";
import { getCollectionState } from "~/utils/errors/get-collection-state";

/** Props for {@link CollectionList}. Same map API as {@link ItemListProps} plus outcomes. */
export type CollectionListProps<
  T extends Id,
  P,
  E extends ElementType = "div",
> = Prettify<
  CollectionOutcomeProps & Items<T> & Omit<ItemListProps<T, P, E>, "items">
>;

/**
 * Uncertain collection: `items` is `List<T>` (`T[] | null | undefined`).
 *
 * Reach for this when a loader, deferred promise, or filter can yield empty,
 * no-match, or missing data — catalog vans, host vans/rentals, `DeferredItems`,
 * `DeferredPaginated`. Passes `emptyState` / `errorState` / `noMatchState` (and
 * optional `noMatchWhen`) through {@link getCollectionState}, then
 * {@link OutcomeState} or {@link ItemList} on success.
 *
 * Config arrays that exist as `T[]` use {@link ItemList} only. Deferred promise
 * reject still goes to `<Await>` `errorElement`; this handles the resolved value
 * (`[]` or `null`).
 */
const CollectionList = <T extends Id, P, E extends ElementType = "div">({
  Component,
  items,
  renderProps,
  className,
  emptyState,
  errorState,
  noMatchState,
  noMatchWhen,
  as,
  wrapperProps,
}: CollectionListProps<T, P, E>) => {
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

  return (
    <ItemList
      as={as}
      Component={Component}
      className={className}
      items={collectionState.data}
      renderProps={renderProps}
      wrapperProps={wrapperProps}
    />
  );
};

export { CollectionList };
