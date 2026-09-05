import { describe, expect, it } from "bun:test";
import {
  formatRouteCount,
  getCurrentHostNavItem,
  getHostNavItemsByGroup,
} from "./host-nav-groups";

const itemIds = (groupId: Parameters<typeof getHostNavItemsByGroup>[0]) =>
  getHostNavItemsByGroup(groupId).map((item) => item.id);

describe("host navigation groups", () => {
  it("keeps the canonical group and source order", () => {
    expect(itemIds("activity")).toEqual([
      "Dashboard",
      "rental-activity",
      "Wallet",
      "Reviews",
    ]);
    expect(itemIds("listings")).toEqual(["Vans", "Add Van"]);
    expect(itemIds("rental-workflow")).toEqual(["host-rentals"]);
  });

  it("formats singular and plural route counts", () => {
    expect(formatRouteCount(1)).toBe("1 route");
    expect(formatRouteCount(7)).toBe("7 routes");
  });
});

describe("getCurrentHostNavItem", () => {
  it("matches the dashboard exactly", () => {
    expect(getCurrentHostNavItem("/host")?.id).toBe("Dashboard");
  });

  it("prefers Vans over the duplicate primary Add Van record", () => {
    expect(getCurrentHostNavItem("/host/vans")?.id).toBe("Vans");
  });

  it("maps nested host routes to their parent destination", () => {
    expect(getCurrentHostNavItem("/host/vans/camper/edit")?.id).toBe("Vans");
    expect(getCurrentHostNavItem("/host/rentals/rent/camper")?.id).toBe(
      "host-rentals"
    );
  });

  it("returns undefined for an unknown host path", () => {
    expect(getCurrentHostNavItem("/host/not-a-route")).toBeUndefined();
  });
});
