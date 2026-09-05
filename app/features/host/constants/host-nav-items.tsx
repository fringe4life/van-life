import {
  ArrowRightLeft,
  Car,
  KeySquare,
  LayoutDashboard,
  SquarePlus,
  Star,
  Wallet,
} from "lucide-react";
import { href } from "react-router";
import type { HostNavItem } from "./host-nav-types";

const hostNavItems = [
  {
    currentBehavior: "route",
    end: true,
    group: "activity",
    icon: LayoutDashboard,
    id: "Dashboard",
    label: "Dashboard",
    to: href("/host"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: ArrowRightLeft,
    id: "rental-activity",
    label: "Rentals",
    to: href("/host/rental-activity"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: Wallet,
    id: "Wallet",
    label: "Wallet",
    to: href("/host/wallet-activity"),
  },
  {
    currentBehavior: "route",
    group: "listings",
    icon: Car,
    id: "Vans",
    label: "Vans",
    to: href("/host/vans"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: Star,
    id: "Reviews",
    label: "Reviews",
    to: href("/host/review"),
  },
  {
    currentBehavior: "never",
    group: "listings",
    icon: SquarePlus,
    id: "Add Van",
    label: "Add Van",
    to: href("/host/vans"),
  },
  {
    currentBehavior: "route",
    group: "rental-workflow",
    icon: KeySquare,
    id: "host-rentals",
    label: "Your rentals",
    to: href("/host/rentals"),
  },
] as const satisfies readonly HostNavItem[];

export { hostNavItems };
