import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Sign out. Door on the left, arrow leaving it. Same rule as sign in: the
 * mover takes the colour, the frame stays fully opaque.
 *
 * The arrowhead is the hover mechanic: its two barbs pinch toward the shaft
 * about the tip while the whole arrow travels on `glide`. The barbs are
 * separate paths for that reason — a single chevron can only be scaled, and a
 * scaled chevron reads as a stick plane.
 *
 * Literal `css()` per barb, for the reason set out in `log-in-icon.tsx`: the
 * shared factory's parameterised values were never extracted. Direction is the
 * same as sign in — upper barb counter-clockwise, lower clockwise, about a tip
 * that sits 2.6 units further right.
 */

const signOutArrow = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-arrow-out",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-arrow-out",
    animationTimingFunction: "glide",
    color: "primary",
  },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const barbUpper = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-barb-ccw",
    animationTimingFunction: "glide",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-barb-ccw",
    animationTimingFunction: "glide",
  },
  transformBox: "view-box",
  transformOrigin: "17.8px 12px",
});

const barbLower = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-barb-cw",
    animationTimingFunction: "glide",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-barb-cw",
    animationTimingFunction: "glide",
  },
  transformBox: "view-box",
  transformOrigin: "17.8px 12px",
});

const LogOutIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path d="M8.8 21.4H5.2a2.1 2.1 0 0 1-2.1-2.1V4.7a2.1 2.1 0 0 1 2.1-2.1h3.6" />
    <g className={signOutArrow}>
      <path className={barbUpper} d="M13.5 7.7 17.8 12" />
      <path className={barbLower} d="M13.5 16.3 17.8 12" />
      <path d="M9.4 12h8.4" />
    </g>
  </IconShell>
);

export { LogOutIcon };
