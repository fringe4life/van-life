import { describe, expect, it } from "bun:test";
import { getHostVanDetailNavItems } from "./get-host-van-detail-nav-items";

describe("getHostVanDetailNavItems", () => {
  it("builds details, pricing, and photos hrefs for a slug", () => {
    const items = getHostVanDetailNavItems("modest-explorer");

    expect(items.map((item) => item.id)).toEqual([
      "details",
      "pricing",
      "photos",
    ]);
    expect(items[0]?.to).toBe("/host/vans/modest-explorer");
    expect(items[1]?.to).toBe("/host/vans/modest-explorer/pricing");
    expect(items[2]?.to).toBe("/host/vans/modest-explorer/photos");
  });

  it("appends the current search string to every tab", () => {
    const items = getHostVanDetailNavItems(
      "modest-explorer",
      "?cursor=abc&limit=10"
    );

    expect(items[0]?.to).toBe("/host/vans/modest-explorer?cursor=abc&limit=10");
    expect(items[1]?.to).toBe(
      "/host/vans/modest-explorer/pricing?cursor=abc&limit=10"
    );
  });
});
