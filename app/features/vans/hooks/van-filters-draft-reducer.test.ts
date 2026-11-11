import { describe, expect, it } from "bun:test";
import {
  EMPTY_FILTER_STATE,
  filterStateKey,
  planUrlDraftSync,
  vanFiltersDraftReducer,
} from "./van-filters-draft-reducer";

describe("vanFiltersDraftReducer", () => {
  it("keeps the first type when a second type is toggled from draft", () => {
    const afterSimple = vanFiltersDraftReducer(EMPTY_FILTER_STATE, {
      type: "toggleType",
      vanType: "SIMPLE",
    });
    const afterRugged = vanFiltersDraftReducer(afterSimple, {
      type: "toggleType",
      vanType: "RUGGED",
    });

    expect(afterRugged.types).toEqual(["SIMPLE", "RUGGED"]);
  });

  it("stacks a state facet on top of an existing type without dropping it", () => {
    const withType = vanFiltersDraftReducer(EMPTY_FILTER_STATE, {
      type: "toggleType",
      vanType: "LUXURY",
    });
    const withSale = vanFiltersDraftReducer(withType, {
      checked: true,
      key: "onlyOnSale",
      type: "setState",
    });

    expect(withSale).toEqual({
      excludeInRepair: false,
      onlyOnSale: true,
      types: ["LUXURY"],
    });
  });

  it("toggles a type off and clears all filters", () => {
    const withTwo = vanFiltersDraftReducer(
      { excludeInRepair: true, onlyOnSale: false, types: ["SIMPLE", "RUGGED"] },
      { type: "toggleType", vanType: "SIMPLE" }
    );
    expect(withTwo.types).toEqual(["RUGGED"]);
    expect(vanFiltersDraftReducer(withTwo, { type: "clear" })).toEqual(
      EMPTY_FILTER_STATE
    );
  });

  it("hydrates from URL without merging into prior draft", () => {
    const draft = {
      excludeInRepair: true,
      onlyOnSale: true,
      types: ["SIMPLE" as const],
    };
    const fromUrl = {
      excludeInRepair: false,
      onlyOnSale: false,
      types: ["RUGGED" as const],
    };
    expect(
      vanFiltersDraftReducer(draft, { state: fromUrl, type: "hydrate" })
    ).toEqual(fromUrl);
    expect(filterStateKey(draft)).not.toBe(filterStateKey(fromUrl));
  });
});

describe("planUrlDraftSync", () => {
  const empty = filterStateKey(EMPTY_FILTER_STATE);
  const simple = filterStateKey({
    excludeInRepair: false,
    onlyOnSale: false,
    types: ["SIMPLE"],
  });
  const both = filterStateKey({
    excludeInRepair: false,
    onlyOnSale: false,
    types: ["SIMPLE", "RUGGED"],
  });

  it("skips hydrate when an authored intermediate URL lands before the latest draft", () => {
    expect(
      planUrlDraftSync({
        authoredKeys: new Set([simple, both]),
        committedKey: simple,
        draftKey: both,
        seenUrlKey: empty,
      })
    ).toEqual({ kind: "authoredCommit", seenUrlKey: simple });
  });

  it("hydrates on foreign URL changes such as back/forward", () => {
    expect(
      planUrlDraftSync({
        authoredKeys: new Set([both]),
        committedKey: empty,
        draftKey: both,
        seenUrlKey: both,
      })
    ).toEqual({ kind: "hydrate", seenUrlKey: empty });
  });

  it("clears authored tracking once committed catches the draft", () => {
    expect(
      planUrlDraftSync({
        authoredKeys: new Set([simple, both]),
        committedKey: both,
        draftKey: both,
        seenUrlKey: simple,
      })
    ).toEqual({ kind: "catchUp", seenUrlKey: both });
  });
});
