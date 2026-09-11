import { describe, expect, it } from "bun:test";
import { withSearch } from "./with-search";

describe("withSearch", () => {
  it("returns the pathname when search is empty", () => {
    expect(withSearch("/host/vans", "")).toBe("/host/vans");
  });

  it("appends the raw location search string", () => {
    expect(
      withSearch("/host/vans/modest-explorer", "?cursor=abc&direction=backward")
    ).toBe("/host/vans/modest-explorer?cursor=abc&direction=backward");
  });
});
