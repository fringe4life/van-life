import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Dark. The inverse of the sun: in dark mode the moon is home, so it is lit
 * (filled, stars showing); in light mode it earns attention on hover by
 * glowing — a drop-shadow bloom on the crescent, which is light, not mass, so
 * it runs on `air`.
 *
 * Selection is ink, not hue: on the pale amber chip a light-blue crescent
 * disappears, so the held state fills the shape instead. The two stars then
 * twinkle at 4s, offset by half a period so they never pulse in lockstep
 * (#427).
 */

const moonCrescent = css({
  _dark: { color: "warmSky.400", fillOpacity: 0.24 },
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-glow",
    animationTimingFunction: "air",
    color: "warmSky.400",
    fillOpacity: 0.16,
  },
  _held: { fillOpacity: 0.28 },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-glow",
    animationTimingFunction: "air",
    color: "warmSky.400",
    fillOpacity: 0.16,
  },
  color: "inherit",
  fill: "currentColor",
  fillOpacity: 0,
  transitionDuration: "normal",
  transitionProperty: "fill-opacity,color",
  transitionTimingFunction: "air",
});

/**
 * One literal `css()` per star. A shared base spread into both, or a factory
 * taking the delay, reaches the class name but never the stylesheet — see the
 * extraction note in `log-in-icon.tsx`. The twinkle is a held-state loop, so it
 * only starts once the moon is the selected theme; `animationDelay` carries the
 * phase offset.
 */
const starLeading = css({
  _dark: { color: "warmSky.400", opacity: 1 },
  _foc: { opacity: 1 },
  _held: {
    animationDelay: "0s",
    animationDuration: "4s",
    animationIterationCount: "infinite",
    animationName: "icon-twinkle",
    animationTimingFunction: "air",
    color: "warmSky.400",
    opacity: 1,
  },
  _hov: { opacity: 1 },
  color: "inherit",
  fill: "currentColor",
  opacity: 0,
  transitionDuration: "normal",
  transitionProperty: "opacity,color",
  transitionTimingFunction: "air",
});

const starTrailing = css({
  _dark: { color: "warmSky.400", opacity: 1 },
  _foc: { opacity: 1 },
  _held: {
    animationDelay: "-2s",
    animationDuration: "4s",
    animationIterationCount: "infinite",
    animationName: "icon-twinkle",
    animationTimingFunction: "air",
    color: "warmSky.400",
    opacity: 1,
  },
  _hov: { opacity: 1 },
  color: "inherit",
  fill: "currentColor",
  opacity: 0,
  transitionDuration: "normal",
  transitionProperty: "opacity,color",
  transitionTimingFunction: "air",
});

const MoonIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path
      className={moonCrescent}
      d="M12 2.3a6.5 6.5 0 0 0 9.7 9.7 9.7 9.7 0 1 1-9.7-9.7Z"
    />
    <g stroke="none">
      <circle className={starLeading} cx="8.5" cy="15.1" r="1.35" />
      <circle className={starTrailing} cx="11.1" cy="10.9" r="0.85" />
    </g>
  </IconShell>
);

export { MoonIcon };
