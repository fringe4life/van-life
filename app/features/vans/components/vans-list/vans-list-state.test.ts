import { describe, expect, it } from "bun:test";
import {
  buildVansListErrorState,
  hasActiveVansListFilters,
} from "./vans-list-state";

const noFilters = {
  excludeInRepair: false,
  onlyOnSale: false,
  search: "",
  types: [],
} as const;

describe("hasActiveVansListFilters", () => {
  it("returns false when no search or filters are active", () => {
    expect(hasActiveVansListFilters(noFilters)).toBe(false);
  });

  it("ignores whitespace-only searches", () => {
    expect(hasActiveVansListFilters({ ...noFilters, search: "   " })).toBe(
      false
    );
  });

  it("detects an active search or type filter", () => {
    expect(hasActiveVansListFilters({ ...noFilters, search: "explorer" })).toBe(
      true
    );
    expect(hasActiveVansListFilters({ ...noFilters, types: ["simple"] })).toBe(
      true
    );
  });

  it("detects each boolean filter", () => {
    expect(
      hasActiveVansListFilters({ ...noFilters, excludeInRepair: true })
    ).toBe(true);
    expect(hasActiveVansListFilters({ ...noFilters, onlyOnSale: true })).toBe(
      true
    );
  });
});

describe("buildVansListErrorState", () => {
  it("adds a reload action for the current location", () => {
    expect(buildVansListErrorState("/vans?search=explorer")).toEqual({
      description: "We couldn't load the van catalogue. Please try again.",
      primaryAction: {
        kind: "reload",
        label: "Try again",
        to: "/vans?search=explorer",
      },
      title: "Catalogue unavailable",
    });
  });
});
