import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Host. Two masses, two curves: the head lifts on `spring` (light, gives a
 * little) while the shoulders broaden on `glide` (heavier, settles flat).
 *
 * Ink takes `primary` while it moves; on the current page the torso reads as
 * a filled badge so the active route is legible without an underline alone.
 */

const hostInk = css({
  _cur: { color: "primary" },
  _foc: { color: "primary" },
  _hov: { color: "primary" },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const hostHead = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const hostShoulders = css({
  _cur: { fillOpacity: 0.16 },
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-broaden",
    animationTimingFunction: "glide",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-broaden",
    animationTimingFunction: "glide",
  },
  fill: "currentColor",
  fillOpacity: 0,
  transformBox: "fill-box",
  transformOrigin: "center bottom",
  transitionDuration: "normal",
  transitionProperty: "fill-opacity",
  transitionTimingFunction: "air",
});

const UserIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={hostInk}>
      <circle className={hostHead} cx="12" cy="7.1" r="2.9" />
      <path
        className={hostShoulders}
        d="M4.6 20.6c0-4 3.2-6.4 7.4-6.4s7.4 2.4 7.4 6.4"
      />
    </g>
  </IconShell>
);

export { UserIcon };
