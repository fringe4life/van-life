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
import type { CustomNavLinkProps } from "~/features/navigation/components/custom-nav-link";

const hostNavItems = [
  {
    children: (
      <>
        <LayoutDashboard className="aspect-square" />
        <span>Dashboard</span>
      </>
    ),
    end: true,
    id: "Dashboard",
    to: href("/host"),
  },
  {
    children: (
      <>
        <ArrowRightLeft className="aspect-square" />
        <span>Rentals</span>
      </>
    ),
    id: "rental-activity",
    to: href("/host/rental-activity"),
  },
  {
    children: (
      <>
        <Wallet className="aspect-square" />
        <span>Wallet</span>
      </>
    ),
    id: "Wallet",
    to: href("/host/wallet-activity"),
  },
  {
    children: (
      <>
        <Car className="aspect-square" />
        <span>Vans</span>
      </>
    ),
    id: "Vans",
    to: href("/host/vans"),
  },
  {
    children: (
      <>
        <Star className="aspect-square" />
        <span>Reviews</span>
      </>
    ),
    id: "Reviews",
    to: href("/host/review"),
  },
  {
    children: (
      <>
        <SquarePlus className="aspect-square" />
        <span>Add Van</span>
      </>
    ),
    id: "Add Van",
    to: href("/host/vans"),
  },
  {
    children: (
      <>
        <KeySquare className="aspect-square" />
        <span>Your rentals</span>
      </>
    ),
    id: "host-rentals",
    to: href("/host/rentals"),
  },
] satisfies CustomNavLinkProps[];

export { hostNavItems };
