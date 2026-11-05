import { href } from "react-router";
import { css } from "styled-system/css";
import { InfoIcon } from "~/components/icons/info-icon";
import { LogInIcon } from "~/components/icons/log-in-icon";
import { LogOutIcon } from "~/components/icons/log-out-icon";
import { UserIcon } from "~/components/icons/user-icon";
import { VanIcon } from "~/components/icons/van-icon";
import { linkClassName, navLinkClassName } from "../styles";
import type { NavItem } from "../types";

const navIconClassName = css({
  blockSize: "26px",
  inlineSize: "26px",
});

/*
 * Label is the disambiguator, not the headline: 12px and quieter than the 26px
 * glyph. Opacity rather than a muted colour so the link's own hover colour
 * still reads through.
 */
const navLabelClassName = css({
  _cur: { opacity: 1 },
  _hov: { opacity: 1 },
  ".pending &": { color: "success", opacity: 1 },
  fontSize: "xs",
  letterSpacing: "0.01em",
  opacity: 0.72,
});

const pageNavItems = [
  {
    children: (
      <>
        <InfoIcon className={navIconClassName} />
        <span className={navLabelClassName}>About</span>
      </>
    ),
    id: "about",
    props: {
      className: navLinkClassName,
      to: href("/about"),
    },
    type: "nav-link",
  },
  {
    children: (
      <>
        <VanIcon className={navIconClassName} />
        <span className={navLabelClassName}>Vans</span>
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
        <UserIcon className={navIconClassName} />
        <span className={navLabelClassName}>Account</span>
      </>
    ),
    id: "host",
    props: { className: navLinkClassName, to: href("/host") },
    type: "nav-link",
  },
  {
    children: (
      <>
        <LogOutIcon className={navIconClassName} />
        <span className={navLabelClassName}>Sign out</span>
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
        <LogInIcon className={navIconClassName} />
        <span className={navLabelClassName}>Login</span>
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
