import { Info, LogIn, LogOut, Truck, User } from "lucide-react";
import { href } from "react-router";
import { css } from "styled-system/css";
import { linkClassName, navLinkClassName } from "../styles";
import type { NavItem } from "../types";

const navIconClassName = css({ aspectRatio: "square" });

const pageNavItems = [
  {
    children: (
      <>
        <Info className={navIconClassName} />
        <span>About</span>
      </>
    ),
    id: "about",
    props: { className: navLinkClassName, to: href("/about") },
    type: "nav-link",
  },
  {
    children: (
      <>
        <Truck className={navIconClassName} />
        <span>Vans</span>
      </>
    ),
    id: "vans",
    props: { className: navLinkClassName, to: href("/vans") },
    type: "nav-link",
  },
] as const satisfies readonly NavItem[];

const authenticatedNavItems = [
  {
    children: (
      <>
        <User className={navIconClassName} />
        <span>Host</span>
      </>
    ),
    id: "host",
    props: { className: navLinkClassName, to: href("/host") },
    type: "nav-link",
  },
  {
    children: (
      <>
        <LogOut className={navIconClassName} />
        <span>Sign out</span>
      </>
    ),
    id: "signout",
    props: { className: linkClassName },
    type: "form",
  },
] as const satisfies readonly NavItem[];

const signedOutNavItems = [
  {
    children: (
      <>
        <LogIn className={navIconClassName} />
        <span>Login</span>
      </>
    ),
    id: "login",
    props: { className: navLinkClassName, to: href("/login") },
    type: "nav-link",
  },
] as const satisfies readonly NavItem[];

export function getAuthNavItems(hasToken: boolean): readonly NavItem[] {
  return hasToken ? authenticatedNavItems : signedOutNavItems;
}

export { pageNavItems };
