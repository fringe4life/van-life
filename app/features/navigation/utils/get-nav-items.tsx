import { Info, LogIn, LogOut, Truck, User } from "lucide-react";
import { href } from "react-router";
import { css } from "../../../../styled-system/css";
import { linkClassName, navLinkClassName } from "../styles";
import type { NavItem } from "../types";

const navIconClassName = css({ aspectRatio: "square" });

export function getNavItems(hasToken: boolean): NavItem[] {
  const items = [
    {
      children: (
        <>
          <Info className={navIconClassName} />
          <span>About</span>
        </>
      ),
      id: "about",
      props: { className: navLinkClassName, to: href("/about") },
      show: true,
      type: "nav-link",
    },
    {
      children: (
        <>
          <User className={navIconClassName} />
          <span>Host</span>
        </>
      ),
      id: "host",
      props: { className: navLinkClassName, to: href("/host") },
      show: hasToken,
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
      show: true,
      type: "nav-link",
    },
    {
      children: (
        <>
          <LogIn className={navIconClassName} />
          <span>Login</span>
        </>
      ),
      id: "login",
      props: { className: navLinkClassName, to: href("/login") },
      show: !hasToken,
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
      props: { className: linkClassName, to: href("/signout") },
      show: !!hasToken,
      type: "link",
    },
  ] satisfies NavItem[];

  return items.filter((item) => item.show);
}
