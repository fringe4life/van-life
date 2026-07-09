import type { ReactNode } from "react";
import type { NavLinkRenderProps } from "react-router";
import type { Prettify } from "~/types";
import type { CustomLinkProps } from "./components/custom-link";
import type { CustomNavLinkProps } from "./components/custom-nav-link";

/** Props passed to NavLink `className`, `style`, and `children` render functions. */
export type NavLinkClassNameProps = NavLinkRenderProps;

interface BaseNavItem {
  children: ReactNode;
  id: string;
  show: boolean;
}

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
