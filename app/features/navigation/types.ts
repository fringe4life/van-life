import type { NavLinkRenderProps } from "react-router";
import type { Children, Id, Prettify } from "~/types";
import type { CustomLinkProps } from "../../components/links/custom-link";
import type { CustomNavLinkProps } from "../../components/links/custom-nav-link";

/** Props passed to NavLink `className`, `style`, and `children` render functions. */
export type NavLinkClassNameProps = NavLinkRenderProps;

type BaseNavItem = Prettify<Children & Id>;

export interface NavigationGroups {
  readonly auth: readonly NavItem[];
  readonly pages: readonly NavItem[];
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

type FormItem = Prettify<
  BaseNavItem & {
    type: "form";
    props: { className: string };
  }
>;

export type NavItem = FormItem | LinkItem | NavLinkItem;
