import { matchPath } from "react-router";
import { hostNavItems } from "./host-nav-items";
import type {
  HostNavGroup,
  HostNavGroupId,
  HostNavItem,
} from "./host-nav-types";

const hostNavGroups = [
  {
    id: "activity",
    itemIds: ["Dashboard", "rental-activity", "Wallet", "Reviews"],
    label: "Activity",
  },
  {
    id: "listings",
    itemIds: ["Vans", "Add Van"],
    label: "Listings",
  },
  {
    id: "rental-workflow",
    itemIds: ["host-rentals"],
    label: "Rental workflow",
  },
] as const satisfies readonly HostNavGroup[];

export function formatRouteCount(count: number): string {
  return `${count} ${count === 1 ? "route" : "routes"}`;
}

export function getHostNavItemsByGroup(groupId: HostNavGroupId): HostNavItem[] {
  const group = hostNavGroups.find((candidate) => candidate.id === groupId);

  if (!group) {
    return [];
  }

  return group.itemIds.flatMap((itemId) => {
    const item = hostNavItems.find((candidate) => candidate.id === itemId);
    return item ? [item] : [];
  });
}

export function getCurrentHostNavItem(
  pathname: string
): HostNavItem | undefined {
  const matches = hostNavItems.filter(
    (item) =>
      matchPath(
        { end: "end" in item ? item.end : false, path: item.to },
        pathname
      ) !== null
  );

  return matches.find((item) => item.id === "Vans") ?? matches[0];
}

export { hostNavGroups };
