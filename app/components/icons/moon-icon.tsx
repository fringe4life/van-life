import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Dark. The inverse of the sun: in dark mode the moon is home, so it is lit
 * (filled, craters showing); in light mode it earns attention on hover by
 * glowing — a drop-shadow bloom on the crescent, which is light, not mass, so
 * it runs on `air`.
 *
 * Selection is ink, not hue: on the pale amber chip a light-blue crescent
 * disappears, so the held state fills the shape instead.
 */

const moonCrescent = css({
  _dark: { color: "warmSky.400", fillOpacity: 0.24 },
  _groupFocusVisible: {
    animationDuration: "760ms",
    animationName: "icon-glow",
    animationTimingFunction: "air",
    color: "warmSky.400",
    fillOpacity: 0.16,
  },
  _groupHeld: { fillOpacity: 0.28 },
  _groupHover: {
    animationDuration: "760ms",
    animationName: "icon-glow",
    animationTimingFunction: "air",
    color: "warmSky.400",
    fillOpacity: 0.16,
  },
  _motionReduce: { animationName: "none" },
  color: "inherit",
  fill: "currentColor",
  fillOpacity: 0,
  transitionDuration: "240ms",
  transitionProperty: "fill-opacity,color",
  transitionTimingFunction: "air",
});

const moonCraters = css({
  _dark: { color: "warmSky.400", opacity: 1 },
  _groupFocusVisible: { opacity: 1 },
  _groupHeld: { opacity: 1 },
  _groupHover: { opacity: 1 },
  color: "inherit",
  fill: "currentColor",
  opacity: 0,
  transitionDuration: "240ms",
  transitionProperty: "opacity,color",
  transitionTimingFunction: "air",
});

const MoonIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path
      className={moonCrescent}
      d="M12 2.3a6.5 6.5 0 0 0 9.7 9.7 9.7 9.7 0 1 1-9.7-9.7Z"
    />
    <g className={moonCraters} stroke="none">
      <circle cx="8.5" cy="15.1" r="1.35" />
      <circle cx="11.1" cy="10.9" r="0.85" />
    </g>
  </IconShell>
);

export { MoonIcon };
