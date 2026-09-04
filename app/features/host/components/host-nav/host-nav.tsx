import { cx } from "styled-system/css";
import { cq } from "styled-system/patterns";
import { ItemList } from "~/components/item-list";
import { Card } from "~/components/ui/card";
import { hostNavGroups } from "../../constants/host-nav-groups";
import type { HostNavGroup as HostNavGroupData } from "../../constants/host-nav-types";
import { HostNavGroup } from "./host-nav-group";
import {
  hostNavClassName,
  hostNavGroupLayoutClassName,
  hostNavGroupsClassName,
  hostNavKickerClassName,
  hostNavSurfaceClassName,
} from "./styles";

const renderHostNavGroupProps = (group: HostNavGroupData) => ({
  className: hostNavGroupLayoutClassName,
  groupId: group.id,
  headingIdPrefix: "desktop-tablet",
});

const HostNav = () => (
  <nav
    aria-label="Host navigation"
    className={cx(cq({ name: "host-nav" }), hostNavClassName)}
  >
    <Card className={hostNavSurfaceClassName}>
      <div className={hostNavKickerClassName}>
        Host index
        <strong>Seven routes, three jobs</strong>
      </div>
      <ItemList
        Component={HostNavGroup}
        className={hostNavGroupsClassName}
        items={hostNavGroups}
        renderProps={renderHostNavGroupProps}
      />
    </Card>
  </nav>
);

export { HostNav };
