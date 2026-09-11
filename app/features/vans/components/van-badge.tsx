import { ViewTransition } from "react";
import { css } from "styled-system/css";
import { Badge } from "~/components/ui/badge";
import { viewTransitionShare } from "~/components/view-transition-share";
import { formatEnumLabel } from "~/features/vans/utils/format-enum";
import { ListingChrome, type VanProps } from "../types";
import { vanViewTransitionName } from "./van-view-transitions";

interface VanBadgeProps extends VanProps {}

const vanStatusBadgeClassName = css({
  insetBlockStart: "-2",
  insetInlineEnd: "-2",
  position: "absolute",
  zIndex: "10",
});

const VanBadge = ({ van }: VanBadgeProps) => {
  const { listingChrome } = van;
  if (
    listingChrome !== ListingChrome.IN_REPAIR &&
    listingChrome !== ListingChrome.NEW
  ) {
    return null;
  }

  const label = formatEnumLabel(listingChrome);

  return (
    <ViewTransition
      {...viewTransitionShare}
      name={vanViewTransitionName.status(van.id)}
    >
      <Badge
        className={vanStatusBadgeClassName}
        title={label}
        variant={listingChrome}
      >
        {label}
      </Badge>
    </ViewTransition>
  );
};

export { VanBadge };
