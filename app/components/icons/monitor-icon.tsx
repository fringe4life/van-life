import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * System. The screen is the moving part (a refresh step on `air`, so it reads
 * as a flicker rather than a swell); the stand nudges on `spring`. Colour
 * lands on the screen only — the fallen-back state deserves a hint of hue too,
 * otherwise it is the one glyph in the row that never reacts.
 */

const monitorScreen = css({
  _groupFocusVisible: {
    animationDuration: "420ms",
    animationName: "icon-flicker",
    animationTimingFunction: "air",
    color: "warmSky.400",
  },
  _groupHeld: { fillOpacity: 0.18 },
  _groupHover: {
    animationDuration: "420ms",
    animationName: "icon-flicker",
    animationTimingFunction: "air",
    color: "warmSky.400",
  },
  _motionReduce: { animationName: "none" },
  color: "inherit",
  fill: "currentColor",
  fillOpacity: 0,
  transitionDuration: "220ms",
  transitionProperty: "fill-opacity,color",
  transitionTimingFunction: "air",
});

const monitorStand = css({
  _groupFocusVisible: {
    animationDuration: "560ms",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  _groupHover: {
    animationDuration: "560ms",
    animationName: "icon-lift",
    animationTimingFunction: "spring",
  },
  _motionReduce: { animationName: "none" },
  transformBox: "fill-box",
  transformOrigin: "center top",
});

const MonitorIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <rect
      className={monitorScreen}
      height="13.4"
      rx="2"
      width="19.2"
      x="2.4"
      y="3.4"
    />
    <g className={monitorStand}>
      <path d="M8.8 20.6h6.4" />
      <path d="M12 16.8v3.8" />
    </g>
  </IconShell>
);

export { MonitorIcon };
