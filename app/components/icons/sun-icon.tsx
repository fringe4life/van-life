import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Light. All eight rays are always drawn — four rays around a disc reads as a
 * crosshair, not a sun. The states then separate on hue and mass:
 *
 *   rest     currentColor outline
 *   hover    amber, disc lit, rays bloom (`icon-shine`)
 *   held     amber, disc lit, rays settled — a selected sun states its colour
 *            and stops. A spin inside a three-way segmented control would
 *            compete with the selection (#426).
 *            `_groupHeld`: the header trigger wears this glyph too, and a
 *            button holds a value without containing the radio that set it.
 *   dark     amber and lit at rest, because it is the way back out
 *
 * Rays run from r6.9 to r9.9 against a r4.6 disc, so the glyph fills the box
 * at nav size instead of floating in the middle of it.
 */

const sunRays = css({
  _dark: { color: "warmAmber.400", scale: "1.06" },
  _groupFocusVisible: {
    animationDuration: "620ms",
    animationName: "icon-shine",
    animationTimingFunction: "spring",
    color: "warmAmber.400",
  },
  _groupHeld: {
    color: "warmAmber.400",
  },
  _groupHover: {
    animationDuration: "620ms",
    animationName: "icon-shine",
    animationTimingFunction: "spring",
    color: "warmAmber.400",
  },
  _motionReduce: { animationName: "none" },
  color: "inherit",
  transformBox: "fill-box",
  transformOrigin: "center",
  transitionDuration: "180ms",
  transitionProperty: "color",
  transitionTimingFunction: "spring",
});

const sunCore = css({
  _dark: { color: "warmAmber.400", fillOpacity: 1 },
  _groupFocusVisible: { color: "warmAmber.400", fillOpacity: 1 },
  _groupHeld: { color: "warmAmber.400", fillOpacity: 1 },
  _groupHover: { color: "warmAmber.400", fillOpacity: 1 },
  color: "inherit",
  fill: "currentColor",
  fillOpacity: 0,
  transitionDuration: "220ms",
  transitionProperty: "fill-opacity,color",
  transitionTimingFunction: "air",
});

const SunIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <circle className={sunCore} cx="12" cy="12" r="4.6" />
    <g className={sunRays} strokeWidth={2}>
      <path d="M12 2.1v3" />
      <path d="M12 18.9v3" />
      <path d="M2.1 12h3" />
      <path d="M18.9 12h3" />
      <path d="m5.1 5.1 2.1 2.1" />
      <path d="M18.9 18.9l-2.1-2.1" />
      <path d="M18.9 5.1l-2.1 2.1" />
      <path d="M7.2 16.8l-2.1 2.1" />
    </g>
  </IconShell>
);

export { SunIcon };
