import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Sign in. Door on the right, arrow travelling into it. The arrow is the
 * thing that moves, so the arrow is the thing that takes colour — and the
 * frame keeps full opacity, because a half-faded stroke over the amber hover
 * surface reads as the wall changing colour rather than as depth.
 *
 * Same arrowhead mechanic as sign out, mirrored: the barbs pinch toward the
 * shaft about the tip while the arrow glides in.
 *
 * One literal `css()` per barb. The shared factory this replaced took the
 * keyframe name and the origin as arguments, which static extraction cannot
 * read: it emitted class names with no rules, and the then-unreferenced
 * keyframes were dropped from the stylesheet, so the barbs never moved.
 *
 * Direction: the upper barb leaves the tip up-and-left at 45°, so flattening
 * it toward the shaft is a counter-clockwise rotation; the lower barb mirrors
 * that. Getting these two the same way round is what closes the head.
 */

const signInArrow = css({
  _cur: { color: "primary", translate: "1.4px 0" },
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-arrow-in",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-arrow-in",
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
  transformOrigin: "15.2px 12px",
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
  transformOrigin: "15.2px 12px",
});

const LogInIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path d="M15.2 2.6h3.6a2.1 2.1 0 0 1 2.1 2.1v14.6a2.1 2.1 0 0 1-2.1 2.1h-3.6" />
    <g className={signInArrow}>
      <path className={barbUpper} d="M10.9 7.7 15.2 12" />
      <path className={barbLower} d="M10.9 16.3 15.2 12" />
      <path d="M2.6 12h12.6" />
    </g>
  </IconShell>
);

export { LogInIcon };
