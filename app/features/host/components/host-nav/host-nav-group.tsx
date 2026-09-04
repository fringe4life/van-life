import { cx } from "styled-system/css";
import { ItemList } from "~/components/item-list";
import {
  getHostNavItemsByGroup,
  hostNavGroups,
} from "../../constants/host-nav-groups";
import type {
  HostNavGroupId,
  HostNavItem,
} from "../../constants/host-nav-types";
import { HostNavHeader } from "./host-nav-header";
import { HostNavLink } from "./host-nav-link";
import {
  hostNavActivityListClassName,
  hostNavGroupClassName,
  hostNavListClassName,
} from "./styles";

interface HostNavGroupProps {
  className?: string;
  groupId: HostNavGroupId;
  headingIdPrefix: string;
  listClassName?: string;
}

const HostNavListItem = ({ item }: { item: HostNavItem }) => (
  <li>
    <HostNavLink item={item} />
  </li>
);

const renderHostNavListItemProps = (item: HostNavItem) => ({ item });

const HostNavGroup = ({
  className,
  groupId,
  headingIdPrefix,
  listClassName,
}: HostNavGroupProps) => {
  const group = hostNavGroups.find((candidate) => candidate.id === groupId);

  if (!group) {
    return null;
  }

  const items = getHostNavItemsByGroup(groupId);
  const headingId = `${headingIdPrefix}-${group.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cx(hostNavGroupClassName, className)}
    >
      <HostNavHeader
        group={group}
        headingId={headingId}
        itemCount={items.length}
      />
      <ItemList
        as="ul"
        Component={HostNavListItem}
        className={cx(
          hostNavListClassName,
          group.id === "activity" && hostNavActivityListClassName,
          listClassName
        )}
        items={items}
        renderProps={renderHostNavListItemProps}
      />
    </section>
  );
};

export type { HostNavGroupProps };
export { HostNavGroup };
