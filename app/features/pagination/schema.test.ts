import { describe, expect, it } from "bun:test";
import { DEFAULT_LIMIT } from "./pagination-constants";
import { hostPaginationParsers, parseLimit } from "./schema";

describe("parseLimit", () => {
  it("accepts allowlisted numbers", () => {
    expect(parseLimit(20)).toBe(20);
  });

  it("falls back to DEFAULT_LIMIT when invalid", () => {
    expect(parseLimit(99)).toBe(DEFAULT_LIMIT);
    expect(parseLimit(Number.NaN)).toBe(DEFAULT_LIMIT);
  });
});

describe("nuqs pagination parsers", () => {
  it("parses allowlisted query literals", () => {
    expect(hostPaginationParsers.limit.parse("20")).toBe(20);
    expect(hostPaginationParsers.direction.parse("backward")).toBe("backward");
    expect(hostPaginationParsers.sort.parse("oldest")).toBe("oldest");
  });

  it("returns null for values outside the allowlist", () => {
    expect(hostPaginationParsers.limit.parse("99")).toBeNull();
    expect(hostPaginationParsers.direction.parse("sideways")).toBeNull();
    expect(hostPaginationParsers.sort.parse("price")).toBeNull();
  });
});
