import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Host fleet. Deliberately not the public van glyph: the header van means
 * "browse vans", this one means "the cars I have listed", and one vehicle for
 * both jobs reads as a link to the same place.
 *
 * The wheels are the mechanic, drawn the way the header van draws them: an open
 * tyre with a hub, so the quarter turn is read off the gap instead of a ring
 * turning into itself at 20px. Each wheel also carries its own literal
 * `transform-origin` in user units — a shared origin would swing the tyre
 * around the view box corner instead of its axle. The body settles on `spring`,
 * like a car rocking on its suspension.
 */

const frontWheel = css({
  _cur: { color: "primary" },
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-quarter-turn",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-quarter-turn",
    animationTimingFunction: "glide",
    color: "primary",
  },
  color: "inherit",
  transformBox: "view-box",
  transformOrigin: "7.6px 17.4px",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const rearWheel = css({
  _cur: { color: "primary" },
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-quarter-turn",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-quarter-turn",
    animationTimingFunction: "glide",
    color: "primary",
  },
  color: "inherit",
  transformBox: "view-box",
  transformOrigin: "16.4px 17.4px",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const carBody = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-sink",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-sink",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center bottom",
});

const CarIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={carBody}>
      <path d="M3.2 15.4V12.7c0-.64.4-1.2.99-1.4l2.6-.86 2.4-2.86a2.2 2.2 0 0 1 1.65-.72h1.62a2.2 2.2 0 0 1 1.65.72l2.4 2.86 3.3.75c.6.2 1 .76 1 1.4V15.4z" />
      <path d="M4.9 13h14.2" />
    </g>
    <g className={frontWheel}>
      <path d="M7.6 15.35A2.05 2.05 0 1 1 5.58 17.76" />
      <circle cx="7.6" cy="17.4" fill="currentColor" r="0.5" stroke="none" />
    </g>
    <g className={rearWheel}>
      <path d="M16.4 15.35A2.05 2.05 0 1 1 14.38 17.76" />
      <circle cx="16.4" cy="17.4" fill="currentColor" r="0.5" stroke="none" />
    </g>
  </IconShell>
);

export { CarIcon };
