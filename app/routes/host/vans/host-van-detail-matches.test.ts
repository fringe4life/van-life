import { describe, expect, it } from "bun:test";
import { VanState, VanType } from "~/db/enums";
import type { VanWithChrome } from "~/features/vans/types";
import type { UUIDv7 } from "~/types/ids.server";
import { getHostVanDetailLoaderData } from "./host-van-detail-matches";

const van = {
  createdAt: new Date("2024-01-01T00:00:00Z"),
  description: "A fine van",
  discount: 0,
  hostId: "01900000-0000-7000-8000-000000000001" as UUIDv7,
  id: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  imageUrl: "https://example.com/van.jpg",
  isRented: false,
  listingChrome: VanState.AVAILABLE,
  name: "Test Van",
  price: 80,
  slug: "test-van",
  state: VanState.AVAILABLE,
  type: VanType.SIMPLE,
} satisfies VanWithChrome;

describe("getHostVanDetailLoaderData", () => {
  it("returns parent loader data for the generated host van detail route id", () => {
    const loaderData = { van };

    expect(
      getHostVanDetailLoaderData([
        { id: "root" },
        { id: "routes/host/vans/index", loaderData },
      ])
    ).toBe(loaderData);
  });

  it("throws with actual match ids when the parent loader data is missing", () => {
    expect(() =>
      getHostVanDetailLoaderData([
        { id: "root" },
        { id: "routes/host/vans/photos" },
      ])
    ).toThrow(
      'Host van detail loader data is missing for "routes/host/vans/index". Matches: root, routes/host/vans/photos'
    );
  });

  it("returns parent loader data when van has Date createdAt", () => {
    expect(van.createdAt).toBeInstanceOf(Date);

    const loaderData = { van };

    expect(
      getHostVanDetailLoaderData([{ id: "routes/host/vans/index", loaderData }])
    ).toBe(loaderData);
  });

  it("throws when the matching route has a null van", () => {
    expect(() =>
      getHostVanDetailLoaderData([
        { id: "routes/host/vans/index", loaderData: { van: null } },
      ])
    ).toThrow(
      'Host van detail loader data is missing for "routes/host/vans/index". Matches: routes/host/vans/index'
    );
  });
});
