import { href } from "react-router";
import { CarIcon } from "~/components/icons/car-icon";
import { DashboardIcon } from "~/components/icons/dashboard-icon";
import { KeyIcon } from "~/components/icons/key-icon";
import { RentalsIcon } from "~/components/icons/rentals-icon";
import { SquarePlusIcon } from "~/components/icons/square-plus-icon";
import { StarIcon } from "~/components/icons/star-icon";
import { WalletIcon } from "~/components/icons/wallet-icon";
import type { HostNavItem } from "./host-nav-types";

const hostNavItems = [
  {
    currentBehavior: "route",
    end: true,
    group: "activity",
    icon: DashboardIcon,
    id: "Dashboard",
    label: "Dashboard",
    to: href("/host"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: RentalsIcon,
    id: "rental-activity",
    label: "Rentals",
    to: href("/host/rental-activity"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: WalletIcon,
    id: "Wallet",
    label: "Wallet",
    to: href("/host/wallet-activity"),
  },
  {
    currentBehavior: "route",
    group: "listings",
    icon: CarIcon,
    id: "Vans",
    label: "Vans",
    to: href("/host/vans"),
  },
  {
    currentBehavior: "route",
    group: "activity",
    icon: StarIcon,
    id: "Reviews",
    label: "Reviews",
    to: href("/host/review"),
  },
  {
    currentBehavior: "never",
    group: "listings",
    icon: SquarePlusIcon,
    id: "Add Van",
    label: "Add Van",
    to: href("/host/vans"),
  },
  {
    currentBehavior: "route",
    group: "rental-workflow",
    icon: KeyIcon,
    id: "host-rentals",
    label: "Your rentals",
    to: href("/host/rentals"),
  },
] as const satisfies readonly HostNavItem[];

export { hostNavItems };
