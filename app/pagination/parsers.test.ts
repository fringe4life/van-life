import { describe, expect, it } from "bun:test";
import { hostPaginationParsers } from "./parsers";

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
