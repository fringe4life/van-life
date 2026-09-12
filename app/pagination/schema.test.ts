import { describe, expect, it } from "bun:test";
import { DEFAULT_LIMIT } from "./pagination-constants";
import { limit, parseLimit } from "./schema";

describe("limit catalog", () => {
  it("parses only exact known members", () => {
    expect(limit.parse(5)).toBe(5);
    expect(limit.parse(10)).toBe(10);
    expect(limit.parse(20)).toBe(20);
    expect(limit.parse(50)).toBe(50);
    expect(limit.parse(99)).toBeNull();
    expect(limit.parse("10")).toBeNull();
    expect(limit.parse(Number.NaN)).toBeNull();
  });
});

describe("parseLimit", () => {
  it("accepts allowlisted numbers", () => {
    expect(parseLimit(5)).toBe(5);
    expect(parseLimit(10)).toBe(10);
    expect(parseLimit(20)).toBe(20);
    expect(parseLimit(50)).toBe(50);
  });

  it("falls back to DEFAULT_LIMIT when invalid", () => {
    expect(parseLimit(99)).toBe(DEFAULT_LIMIT);
    expect(parseLimit(Number.NaN)).toBe(DEFAULT_LIMIT);
  });
});
