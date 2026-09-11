import { describe, expect, it } from "bun:test";
import { pageSliceKey, takePageSliceMove } from "./page-slice-key";

describe("pageSliceKey", () => {
  it("joins item ids in list order", () => {
    expect(pageSliceKey([{ id: "a" }, { id: "b" }])).toBe("a\0b");
  });

  it("returns empty for missing or empty lists", () => {
    expect(pageSliceKey(null)).toBe("");
    expect(pageSliceKey(undefined)).toBe("");
    expect(pageSliceKey([])).toBe("");
  });
});

describe("takePageSliceMove", () => {
  it("does nothing when the slice is unchanged", () => {
    expect(takePageSliceMove("a\0b", "a\0b", "forward")).toEqual({
      direction: null,
      isFirstPaint: false,
    });
  });

  it("treats a first paint as a mount, not a pager remount", () => {
    expect(takePageSliceMove("a\0b", null, "forward")).toEqual({
      direction: "forward",
      isFirstPaint: true,
    });
  });

  it("consumes a pending pager direction when the slice changes", () => {
    expect(takePageSliceMove("c\0d", "a\0b", "backward")).toEqual({
      direction: "backward",
      isFirstPaint: false,
    });
  });

  it("lets filter/search slice changes through without a pager move", () => {
    expect(takePageSliceMove("c\0d", "a\0b", null)).toEqual({
      direction: null,
      isFirstPaint: false,
    });
  });
});
