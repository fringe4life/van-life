import { describe, expect, it } from "bun:test";
import type { VanModel } from "~/db/client.server";
import { VanState, VanType } from "~/db/enums";
import type { UUIDv7 } from "~/types/ids.server";
import { createVansListCardProps } from "./vans-list-card";

const van = {
  createdAt: new Date("2024-01-01T00:00:00Z"),
  description: "A fine van",
  discount: 0,
  hostId: "01900000-0000-7000-8000-000000000001" as UUIDv7,
  id: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  imageUrl: "https://example.com/van.jpg",
  isRented: false,
  name: "Test Van",
  price: 80,
  slug: "test-van",
  state: VanState.AVAILABLE,
  type: VanType.SIMPLE,
} satisfies VanModel;

const queryState = {
  cursor: "cursor-id",
  excludeInRepair: true,
  limit: 20,
  onlyOnSale: false,
  search: "explorer",
  types: ["simple"],
};

describe("createVansListCardProps", () => {
  it("builds card props with the current catalog query state", () => {
    const props = createVansListCardProps(van, 2, queryState);

    expect(props.imageIndex).toBe(2);
    expect(props.link).toContain("/vans/test-van?");
    expect(props.link).toContain("cursor=cursor-id");
    expect(props.link).toContain("limit=20");
    expect(props.link).toContain("types=simple");
    expect(props.link).toContain("excludeInRepair=true");
    expect(props.link).toContain("search=explorer");
    expect(props.van).toBe(van);
  });
});
