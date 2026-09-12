import { describe, expect, it } from "bun:test";
import { defineCatalog } from "./catalog";

describe("defineCatalog", () => {
  it("parses only exact known members", () => {
    const colors = defineCatalog(["red", "blue"] as const);

    expect(colors.parse("red")).toBe("red");
    expect(colors.parse("blue")).toBe("blue");
    expect(colors.parse("Red")).toBeNull();
    expect(colors.parse(" red")).toBeNull();
    expect(colors.parse(null)).toBeNull();
  });

  it("includes only exact known members", () => {
    const colors = defineCatalog(["red", "blue"] as const);

    expect(colors.includes("red")).toBe(true);
    expect(colors.includes("blue")).toBe(true);
    expect(colors.includes("Red")).toBe(false);
    expect(colors.includes(null)).toBe(false);
  });

  it("parseMany keeps order and drops misses", () => {
    const colors = defineCatalog(["red", "blue"] as const);

    expect(colors.parseMany(["blue", "Red", "red", null, "blue"])).toEqual([
      "blue",
      "red",
      "blue",
    ]);
    expect(colors.parseMany(["nope"])).toEqual([]);
    expect(colors.parseMany([])).toEqual([]);
  });

  it("excluding derives a subset catalog without relisting keepers", () => {
    const choice = defineCatalog(["light", "dark", "system"] as const);
    const stored = choice.excluding("system");

    expect(stored.values).toEqual(["light", "dark"]);
    expect(stored.parse("light")).toBe("light");
    expect(stored.parse("dark")).toBe("dark");
    expect(stored.parse("system")).toBeNull();
    expect(choice.parse("system")).toBe("system");
  });

  it("exposes values in the given order", () => {
    const colors = defineCatalog(["red", "blue"] as const);

    expect(colors.values).toEqual(["red", "blue"]);
  });

  it("throws when given no values", () => {
    expect(() =>
      defineCatalog(
        // @ts-expect-error catalogs must contain at least one value
        []
      )
    ).toThrow("Literal catalog requires at least one value");
  });

  it("throws when excluding would empty the catalog", () => {
    const colors = defineCatalog(["red"] as const);

    expect(() => colors.excluding("red")).toThrow(
      "Literal catalog requires at least one value"
    );
  });
});
