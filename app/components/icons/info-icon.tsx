import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * About. The `i` is the mechanic, not a bystander: the dot drops back onto
 * the stem on `spring` (a period being written), the stem re-grows from the
 * dot on `air`, and the ring pings once behind it.
 *
 * Ink takes `primary` while it moves; the ring stays `currentColor`.
 */

const aboutRing = css({
  _cur: { opacity: 0.3, scale: "1.14" },
  /*
   * Opacity is the held look; `icon-ping` is only the route to it. Under
   * reduce the global guard kills the animation, so without this endpoint the
   * ring stays at the base `opacity: 0`.
   */
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-ping",
    animationTimingFunction: "air",
    opacity: 0.3,
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-ping",
    animationTimingFunction: "air",
    opacity: 0.3,
  },
  opacity: 0,
  transformBox: "fill-box",
  transformOrigin: "center",
});

const aboutInk = css({
  _cur: { color: "primary" },
  _foc: { color: "primary" },
  _hov: { color: "primary" },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const aboutDot = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-drop",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-drop",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const aboutStem = css({
  _foc: {
    animationDuration: "slowest",
    animationName: "icon-grow",
    animationTimingFunction: "air",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "icon-grow",
    animationTimingFunction: "air",
  },
  transformBox: "fill-box",
  transformOrigin: "top",
});

const InfoIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <circle className={aboutRing} cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="10" />
    <g className={aboutInk}>
      <circle
        className={aboutDot}
        cx="12"
        cy="7.2"
        fill="currentColor"
        r="1.35"
        stroke="none"
      />
      <path className={aboutStem} d="M12 11v6.3" strokeWidth={1.9} />
    </g>
  </IconShell>
);

export { InfoIcon };
