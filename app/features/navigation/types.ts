import type { NavLinkRenderProps } from "react-router";
import type { Children, Id, Prettify } from "~/types";
import type { CustomLinkProps } from "./components/custom-link";
import type { CustomNavLinkProps } from "./components/custom-nav-link";

/** Props passed to NavLink `className`, `style`, and `children` render functions. */
export type NavLinkClassNameProps = NavLinkRenderProps;

type BaseNavItem = Prettify<
  Children &
    Id & {
      show: boolean;
    }
>;

type NavLinkItem = Prettify<
  BaseNavItem & {
    type: "nav-link";
    props: CustomNavLinkProps;
  }
>;

type LinkItem = Prettify<
  BaseNavItem & {
    type: "link";
    props: CustomLinkProps;
  }
>;

export type NavItem = NavLinkItem | LinkItem;
