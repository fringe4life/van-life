import { describe, expect, it } from "bun:test";
// fallow-ignore-next-line -- assert drizzle allowlists match van catalogs
import { vanState, vanType } from "~/features/vans/schema";
import { van } from "./van";

describe("van persistence column allowlists", () => {
  it("type column enum matches vanType catalog set", () => {
    expect(new Set(van.type.enumValues)).toEqual(new Set(vanType.values));
  });

  it("state column enum matches vanState catalog set", () => {
    expect(new Set(van.state.enumValues)).toEqual(new Set(vanState.values));
  });
});
