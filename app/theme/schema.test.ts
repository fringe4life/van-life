import { describe, expect, it } from "bun:test";
import { storedTheme, themeChoice } from "./schema";

describe("themeChoice catalog", () => {
  it("lists light, dark, then system", () => {
    expect(themeChoice.values).toEqual(["light", "dark", "system"]);
  });

  it("accepts only light, dark, and system choices", () => {
    expect(themeChoice.includes("light")).toBe(true);
    expect(themeChoice.includes("dark")).toBe(true);
    expect(themeChoice.includes("system")).toBe(true);
    expect(themeChoice.parse("Dim")).toBeNull();
    expect(themeChoice.parse(null)).toBeNull();
  });
});

describe("storedTheme catalog", () => {
  it("stores only light or dark; everything else is system", () => {
    expect(storedTheme.values).toEqual(["light", "dark"]);
    expect(storedTheme.parse("dark")).toBe("dark");
    expect(storedTheme.parse("light")).toBe("light");
    expect(storedTheme.parse("system")).toBeNull();
    expect(storedTheme.parse(null)).toBeNull();
    expect(storedTheme.parse({})).toBeNull();
  });
});
