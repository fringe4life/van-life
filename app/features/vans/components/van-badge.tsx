import { ViewTransition } from "react";
import { css } from "styled-system/css";
import { Badge } from "~/components/ui/badge";
import { viewTransitionShare } from "~/components/view-transition-share";
import { formatEnumLabel } from "~/features/vans/utils/format-enum";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import type { VanProps } from "../types";
import { vanViewTransitionName } from "./van-view-transitions";

interface VanBadgeProps extends VanProps {}

const VanBadge = ({ van }: VanBadgeProps) => {
  const state = lowercaseVanState(van);
  if (state === "available") {
    return null;
  }

  const labelRaw = state === "new" ? "NEW" : (van.state ?? "AVAILABLE");
  const label = formatEnumLabel(labelRaw);

  return (
    <ViewTransition
      {...viewTransitionShare}
      name={vanViewTransitionName.status(van.id)}
    >
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
    </ViewTransition>
  );
};

export { VanBadge };
