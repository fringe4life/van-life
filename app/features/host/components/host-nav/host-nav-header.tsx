import { formatRouteCount } from "../../constants/host-nav-groups";
import type { HostNavGroup } from "../../constants/host-nav-types";
import {
  hostNavGroupCountClassName,
  hostNavGroupHeadingClassName,
} from "./styles";

interface HostNavHeaderProps {
  group: HostNavGroup;
  headingId: string;
  itemCount: number;
  showCount?: boolean;
}

const HostNavHeader = ({
  group,
  headingId,
  itemCount,
  showCount = false,
}: HostNavHeaderProps) => (
  <h2 className={hostNavGroupHeadingClassName} id={headingId}>
    <span>{group.label}</span>
    {showCount ? (
      <span className={hostNavGroupCountClassName}>
        {formatRouteCount(itemCount)}
      </span>
    ) : null}
  </h2>
);

export type { HostNavHeaderProps };
export { HostNavHeader };
