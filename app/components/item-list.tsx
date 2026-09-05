import type React from "react";
import type { AsProps } from "~/components/types";
import type { Id, Prettify } from "~/types";

/** Props for {@link ItemList}. */
export type ItemListProps<
  T extends Id,
  P,
  E extends React.ElementType = "div",
> = Prettify<
  AsProps<E> & {
    Component: React.ComponentType<P>;
    className?: string;
    items: readonly T[];
    renderProps: (item: T, index: number) => P;
    wrapperProps?: React.ComponentPropsWithoutRef<E>;
  }
>;

/**
 * Maps a guaranteed `readonly T[]` (`T extends Id`) to `Component` via `renderProps`.
 *
 * Reach for this when the collection is config or already filtered and empty/error
 * is not a user-facing outcome: site/host nav, sort buttons, static tabs.
 *
 * Fetched or nullable lists (`List<T>`) use {@link CollectionList}, which renders
 * this on success.
 */
const ItemList = <T extends Id, P, E extends React.ElementType = "div">({
  Component,
  items,
  renderProps,
  className = "",
  as,
  wrapperProps,
}: ItemListProps<T, P, E>) => {
  const Wrapper = as || "div";

  return (
    <Wrapper className={className} {...wrapperProps}>
      {items.map((item, index) => (
        <Component key={item.id} {...renderProps(item, index)} />
      ))}
    </Wrapper>
  );
};

export { ItemList };
