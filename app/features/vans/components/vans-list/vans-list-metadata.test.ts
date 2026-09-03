import { describe, expect, it } from "bun:test";
import {
  getVansListMetadataItems,
  type VansListMetadataItem,
} from "./vans-list-metadata";

const noFilters = {
  excludeInRepair: false,
  onlyOnSale: false,
  search: "",
  types: [],
} as const;

describe("getVansListMetadataItems", () => {
  it("returns no metadata when no filters are active", () => {
    expect(getVansListMetadataItems(noFilters)).toEqual([]);
  });

  it("returns active filters in display order", () => {
    const items: VansListMetadataItem[] = getVansListMetadataItems({
      excludeInRepair: true,
      onlyOnSale: true,
      search: "Explorer",
      types: ["simple", "rugged"],
    });

    expect(items).toEqual([
      { kind: "search", value: "Explorer" },
      { kind: "types", value: "simple, rugged" },
      { kind: "excludeInRepair" },
      { kind: "onlyOnSale" },
    ]);
  });

  it("omits whitespace-only search text", () => {
    expect(getVansListMetadataItems({ ...noFilters, search: "   " })).toEqual(
      []
    );
  });
});
