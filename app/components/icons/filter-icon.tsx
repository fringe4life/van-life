import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { type IconProps, IconShell } from "./icon";

/*
 * The Roadbook heading marker, not a control. It gets no hover response on
 * purpose: anything that moves in a static heading reads as something the
 * reader can press, and this one has no hit target of its own.
 *
 * The state that matters here is a state, not a motion — whether any filters
 * are applied. That is drawn as a fill, and the caller passes it explicitly
 * rather than letting the glyph infer anything from the DOM, so the funnel and
 * the "N active" badge beside it cannot disagree.
 *
 * Drawn as one closed funnel path so the silhouette fills cleanly: the amber
 * surface sits underneath, the ink outline draws on top.
 */

const FUNNEL_PATH = "M20.6 5H3.4l6.6 7.8V19l4.2 2.4v-8.4z";

const funnelFill = css({
  fill: "primary",
  fillOpacity: "0",
  stroke: "none",
  transitionDuration: "normal",
  transitionProperty: "fill-opacity",
  transitionTimingFunction: "air",
});

const funnelFillActive = css({ fillOpacity: "0.2" });

interface FilterIconProps extends IconProps {
  /** `true` once any filter is applied. */
  active?: boolean;
}

const FilterIcon = ({
  active = false,
  className,
  size,
  ...rest
}: FilterIconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path
      className={cx(funnelFill, active && funnelFillActive)}
      d={FUNNEL_PATH}
    />
    <path d={FUNNEL_PATH} />
  </IconShell>
);

export type { FilterIconProps };
export { FilterIcon };
