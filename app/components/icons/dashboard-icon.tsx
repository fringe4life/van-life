import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Dashboard. Four panels, two per column, with the heights alternating between
 * the columns: short over tall on the left, tall over short on the right, and
 * the right column a shade wider. That opposition is what reads as a dashboard
 * rather than as a window frame.
 *
 * The panels land in reading order, 60ms apart, each dropping 1.6px and scaling
 * up on `spring` — a jump large enough to see at 20px. The tall right panel also
 * takes a wash of `primary` on hover and on the current route, because it is the
 * surface that carries content.
 */

const shortLeft = css({
  _foc: {
    animationDelay: "0ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDelay: "0ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const tallRight = css({
  _cur: { fillOpacity: "0.16" },
  _foc: {
    animationDelay: "60ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
    fillOpacity: "0.14",
  },
  _hov: {
    animationDelay: "60ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
    fillOpacity: "0.14",
  },
  fill: "primary",
  fillOpacity: "0",
  transformBox: "fill-box",
  transformOrigin: "center",
  transitionDuration: "normal",
  transitionProperty: "fill-opacity",
  transitionTimingFunction: "air",
});

const tallLeft = css({
  _foc: {
    animationDelay: "120ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDelay: "120ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const shortRight = css({
  _foc: {
    animationDelay: "180ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDelay: "180ms",
    animationDuration: "slowest",
    animationName: "icon-tile-in",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const dashboardInk = css({
  _cur: { color: "primary" },
  _foc: { color: "primary" },
  _hov: { color: "primary" },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const DashboardIcon = ({
  className,
  size,
  ...rest
}: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={dashboardInk}>
      <rect
        className={shortLeft}
        height="6.2"
        rx="2.2"
        width="7.6"
        x="3.2"
        y="3.2"
      />
      <rect
        className={tallRight}
        height="10.2"
        rx="2.2"
        width="8.2"
        x="12.6"
        y="3.2"
      />
      <rect
        className={tallLeft}
        height="9.6"
        rx="2.2"
        width="7.6"
        x="3.2"
        y="11.2"
      />
      <rect
        className={shortRight}
        height="5.6"
        rx="2.2"
        width="8.2"
        x="12.6"
        y="15.2"
      />
    </g>
  </IconShell>
);

export { DashboardIcon };
