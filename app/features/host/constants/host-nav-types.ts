import type { LucideIcon } from "lucide-react";

export type HostNavGroupId = "activity" | "listings" | "rental-workflow";
export type HostNavCurrentBehavior = "route" | "never";
export type HostNavLabel =
  | "Dashboard"
  | "Rentals"
  | "Wallet"
  | "Reviews"
  | "Vans"
  | "Add Van"
  | "Your rentals";

export interface HostNavItem {
  currentBehavior: HostNavCurrentBehavior;
  end?: boolean;
  group: HostNavGroupId;
  icon: LucideIcon;
  id: string;
  label: HostNavLabel;
  to: string;
}

export interface HostNavGroup {
  id: HostNavGroupId;
  itemIds: readonly string[];
  label: "Activity" | "Listings" | "Rental workflow";
}
