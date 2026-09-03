import { Badge } from "~/components/ui/badge";
import { formatEnumLabel } from "~/features/vans/utils/format-enum";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import { css } from "../../../../styled-system/css";
import type { VanProps } from "../types";

interface VanBadgeProps extends VanProps {}

const VanBadge = ({ van }: VanBadgeProps) => {
  const state = lowercaseVanState(van);
  if (state === "available") {
    return null;
  }

  const labelRaw = state === "new" ? "NEW" : (van.state ?? "AVAILABLE");
  const label = formatEnumLabel(labelRaw);

  return (
    <Badge
      className={css({
        insetBlockStart: "4",
        insetInlineEnd: "4",
        position: "absolute",
        zIndex: "10",
      })}
      title={label}
      variant={state}
    >
      {label}
    </Badge>
  );
};

export { VanBadge };
