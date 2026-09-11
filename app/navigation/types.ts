import type { CustomLinkProps } from "~/components/links/custom-link";
import type { CustomNavLinkProps } from "~/components/links/custom-nav-link";
import type { Children, Id, Prettify } from "~/types";

type BaseNavItem = Prettify<Children & Id>;

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
