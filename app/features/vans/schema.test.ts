import { describe, expect, it } from "bun:test";
import { VanType } from "~/db/enums";
import { parseVanType, toValidTypes, vansParsers } from "./schema";

describe("van type schemas", () => {
  it("maps client/form strings to DB VanType", () => {
    expect(parseVanType("simple")).toBe(VanType.SIMPLE);
    expect(parseVanType("SIMPLE")).toBe(VanType.SIMPLE);
    expect(parseVanType(" luxury ")).toBe(VanType.LUXURY);
  });

  it("falls back to SIMPLE when the value is not a van type", () => {
    expect(parseVanType("nope")).toBe(VanType.SIMPLE);
    expect(parseVanType("")).toBe(VanType.SIMPLE);
  });

  it("filters invalid types from a list", () => {
    expect(toValidTypes(["SIMPLE", "nope", "RUGGED"])).toEqual([
      VanType.SIMPLE,
      VanType.RUGGED,
    ]);
  });
});

describe("nuqs van parsers", () => {
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
