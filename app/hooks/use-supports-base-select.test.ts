import { describe, expect, it } from "bun:test";
import { getSupportsBaseSelect } from "./use-supports-base-select";

describe("getSupportsBaseSelect", () => {
  it("is false when the engine only claims CSS.supports without a computed appearance", () => {
    expect(CSS.supports("appearance", "base-select")).toBe(true);
    expect(getSupportsBaseSelect()).toBe(false);
  });
});
