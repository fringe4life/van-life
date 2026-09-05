import type { MouseEventHandler } from "react";
import { cx } from "styled-system/css";
import { ItemList } from "~/components/item-list";
import { PopoverItem, PopoverSection } from "~/components/ui/popover";
import {
  getHostNavItemsByGroup,
  hostNavGroups,
} from "../../constants/host-nav-groups";
import type {
  HostNavGroupId,
  HostNavItem,
} from "../../constants/host-nav-types";
import { HostNavHeader } from "./host-nav-header";
import { HostNavLink, type HostNavLinkProps } from "./host-nav-link";
import {
  hostNavGroupClassName,
  hostNavListClassName,
  hostNavMobileListClassName,
  hostNavMobileSingleColumnListClassName,
} from "./styles";

interface HostNavMobileGroupProps {
  groupId: HostNavGroupId;
  headingIdPrefix: string;
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}

const HostNavPopoverListItem = ({ item, onClick }: HostNavLinkProps) => (
  <PopoverItem>
    <HostNavLink item={item} onClick={onClick} />
  </PopoverItem>
);

const renderHostNavPopoverListItemProps =
  (onClick?: MouseEventHandler<HTMLAnchorElement>) => (item: HostNavItem) => ({
    item,
    onClick,
  });

const HostNavMobileGroup = ({
  groupId,
  headingIdPrefix,
  onLinkClick,
}: HostNavMobileGroupProps) => {
  const group = hostNavGroups.find((candidate) => candidate.id === groupId);

  if (!group) {
    return null;
  }

  const items = getHostNavItemsByGroup(groupId);
  const headingId = `${headingIdPrefix}-${group.id}`;

  return (
    <PopoverSection
      aria-labelledby={headingId}
      className={hostNavGroupClassName}
    >
      <HostNavHeader
        group={group}
        headingId={headingId}
        itemCount={items.length}
        showCount
      />
      <ItemList
        as="ul"
        Component={HostNavPopoverListItem}
        className={cx(
          hostNavListClassName,
          hostNavMobileListClassName,
          group.id === "rental-workflow" &&
            hostNavMobileSingleColumnListClassName
        )}
        items={items}
        renderProps={renderHostNavPopoverListItemProps(onLinkClick)}
      />
    </PopoverSection>
  );
};

export type { HostNavMobileGroupProps };
export { HostNavMobileGroup };
