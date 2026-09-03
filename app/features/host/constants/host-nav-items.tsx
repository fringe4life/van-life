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
import type { CustomNavLinkProps } from "~/components/links/custom-nav-link";
import { css } from "../../../../styled-system/css";

const navIconClassName = css({ aspectRatio: "square" });

const hostNavItems = [
  {
    children: (
      <>
        <LayoutDashboard className={navIconClassName} />
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
        <ArrowRightLeft className={navIconClassName} />
        <span>Rentals</span>
      </>
    ),
    id: "rental-activity",
    to: href("/host/rental-activity"),
  },
  {
    children: (
      <>
        <Wallet className={navIconClassName} />
        <span>Wallet</span>
      </>
    ),
    id: "Wallet",
    to: href("/host/wallet-activity"),
  },
  {
    children: (
      <>
        <Car className={navIconClassName} />
        <span>Vans</span>
      </>
    ),
    id: "Vans",
    to: href("/host/vans"),
  },
  {
    children: (
      <>
        <Star className={navIconClassName} />
        <span>Reviews</span>
      </>
    ),
    id: "Reviews",
    to: href("/host/review"),
  },
  {
    children: (
      <>
        <SquarePlus className={navIconClassName} />
        <span>Add Van</span>
      </>
    ),
    id: "Add Van",
    to: href("/host/vans"),
  },
  {
    children: (
      <>
        <KeySquare className={navIconClassName} />
        <span>Your rentals</span>
      </>
    ),
    id: "host-rentals",
    to: href("/host/rentals"),
  },
] satisfies CustomNavLinkProps[];

export { hostNavItems };
