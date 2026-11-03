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
  _groupCurrent: { color: "primary" },
  _groupFocusVisible: { color: "primary" },
  _groupHover: { color: "primary" },
  color: "inherit",
  transitionDuration: "200ms",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const hostHead = css({
  _groupFocusVisible: {
    animationDuration: "620ms",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  _groupHover: {
    animationDuration: "620ms",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  _motionReduce: { animationName: "none" },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const hostShoulders = css({
  _groupCurrent: { fillOpacity: 0.16 },
  _groupFocusVisible: {
    animationDuration: "560ms",
    animationName: "icon-broaden",
    animationTimingFunction: "glide",
  },
  _groupHover: {
    animationDuration: "560ms",
    animationName: "icon-broaden",
    animationTimingFunction: "glide",
  },
  _motionReduce: { animationName: "none" },
  fill: "currentColor",
  fillOpacity: 0,
  transformBox: "fill-box",
  transformOrigin: "center bottom",
  transitionDuration: "220ms",
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
