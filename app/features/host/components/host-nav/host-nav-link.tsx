import type { MouseEventHandler } from "react";
import { CustomNavLink } from "~/components/links/custom-nav-link";
import type { HostNavItem } from "../../constants/host-nav-types";
import {
  hostNavIconClassName,
  hostNavLinkClassName,
  hostNavLinkLabelClassName,
} from "./styles";

interface HostNavLinkProps {
  item: HostNavItem;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const HostNavLink = ({ item, onClick }: HostNavLinkProps) => {
  const Icon = item.icon;

  return (
    <CustomNavLink
      aria-current={item.currentBehavior === "never" ? "false" : undefined}
      className={hostNavLinkClassName}
      end={item.end}
      onClick={onClick}
      to={item.to}
    >
      <Icon
        aria-hidden="true"
        className={hostNavIconClassName}
        focusable="false"
      />
      <span className={hostNavLinkLabelClassName}>{item.label}</span>
    </CustomNavLink>
  );
};

export type { HostNavLinkProps };
export { HostNavLink };
