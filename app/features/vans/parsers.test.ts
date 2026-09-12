import { describe, expect, it } from "bun:test";
import { VanType } from "~/db/enums";
import { vansParsers } from "./parsers";

describe("nuqs van parsers", () => {
  it("composes pagination slices", () => {
    expect(vansParsers.limit.parse("20")).toBe(20);
    expect(vansParsers.cursor.parse("abc123")).toBe("abc123");
    expect(vansParsers.search.parse("camper")).toBe("camper");
  });

  it("parses uppercase type query literals", () => {
    expect(vansParsers.types.parse("SIMPLE,RUGGED")).toEqual([
      VanType.SIMPLE,
      VanType.RUGGED,
    ]);
  });

  it("drops lowercase query values", () => {
    expect(vansParsers.types.parse("simple,rugged")).toEqual([]);
  });
});
