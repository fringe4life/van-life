// app/utils/collection-state.ts

import type { EmptyState, ErrorState } from "~/components/types";
import type { List, Message, Prettify } from "~/types";

type NonEmptyArray<T> = [T, ...T[]];

type CollectionMessages = Prettify<EmptyState & ErrorState>;

type Error = Prettify<
  {
    kind: "error";
  } & Message
>;
type Empty = Prettify<
  {
    kind: "empty";
  } & Message
>;

interface Ok<T> {
  items: NonEmptyArray<T>;
  kind: "ok";
}

type CollectionState<T> = Error | Empty | Ok<T>;

function getCollectionState<T>(
  items: List<T>,
  { emptyStateMessage, errorStateMessage }: CollectionMessages
): CollectionState<T> {
  if (!items) {
    return { kind: "error", message: errorStateMessage };
  }
  if (items.length === 0) {
    return { kind: "empty", message: emptyStateMessage };
  }
  // length > 0 proven; tuple assertion is safe
  return { items: items as NonEmptyArray<T>, kind: "ok" };
}

export { getCollectionState };
