// app/utils/collection-state.ts

import type { EmptyState, ErrorState } from "~/components/types";
import type { List, Prettify } from "~/types";

type NonEmptyArray<T> = [T, ...T[]];

type CollectionMessages = Prettify<EmptyState & ErrorState>;

interface Error {
  kind: "error";
  message: string;
}
interface Empty {
  kind: "empty";
  message: string;
}
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
