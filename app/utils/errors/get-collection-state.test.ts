import { describe, expect, it } from "bun:test";
import type { CollectionOutcomeProps } from "~/components/types";
import { getCollectionState } from "./get-collection-state";

const outcomes = {
  emptyState: { title: "No items yet" },
  errorState: { title: "Could not load items" },
  noMatchState: { title: "No items match" },
} satisfies CollectionOutcomeProps;

describe("getCollectionState", () => {
  it("returns error for missing collection data", () => {
    expect(getCollectionState(null, outcomes)).toEqual({
      config: outcomes.errorState,
      kind: "error",
      ok: false,
    });
    expect(getCollectionState(undefined, outcomes)).toEqual({
      config: outcomes.errorState,
      kind: "error",
      ok: false,
    });
  });

  it("returns empty for an empty collection without no-match context", () => {
    expect(getCollectionState([], outcomes)).toEqual({
      config: outcomes.emptyState,
      kind: "empty",
      ok: false,
    });
  });

  it("returns no-match for an empty collection with active criteria", () => {
    expect(getCollectionState([], { ...outcomes, noMatchWhen: true })).toEqual({
      config: outcomes.noMatchState,
      kind: "no-match",
      ok: false,
    });
  });

  it("returns ok with the non-empty collection unchanged", () => {
    const items: [{ id: string }] = [{ id: "item-1" }];

    expect(getCollectionState(items, outcomes)).toEqual({
      data: items,
      ok: true,
    });
  });
});
