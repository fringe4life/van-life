import type {
  CollectionOutcome,
  CollectionOutcomeProps,
} from "~/components/types";
import type { List } from "~/types";
import { err, ok, type Result } from "~/utils/result";

type NonEmptyArray<T> = [T, ...T[]];

type CollectionFailure =
  | {
      config: CollectionOutcome;
      kind: "error";
    }
  | {
      config: CollectionOutcome | null;
      kind: "empty";
    }
  | {
      config: CollectionOutcome | null;
      kind: "no-match";
    };

type CollectionState<T> = Result<NonEmptyArray<T>, CollectionFailure>;

function getCollectionState<T>(
  items: List<T>,
  {
    emptyState,
    errorState,
    noMatchState,
    noMatchWhen = false,
  }: CollectionOutcomeProps
): CollectionState<T> {
  if (items === null || items === undefined) {
    return err({ config: errorState, kind: "error" });
  }

  if (items.length === 0) {
    if (noMatchWhen) {
      return err({ config: noMatchState, kind: "no-match" });
    }
    return err({ config: emptyState, kind: "empty" });
  }

  // length > 0 proven; tuple assertion is safe
  return ok(items as NonEmptyArray<T>);
}

export { getCollectionState };
