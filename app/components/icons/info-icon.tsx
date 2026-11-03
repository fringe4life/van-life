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
  _groupCurrent: { opacity: 0.3, scale: "1.14" },
  _groupFocusVisible: {
    animationDuration: "620ms",
    animationName: "icon-ping",
    animationTimingFunction: "air",
  },
  _groupHover: {
    animationDuration: "620ms",
    animationName: "icon-ping",
    animationTimingFunction: "air",
  },
  _motionReduce: { animationName: "none", opacity: 0.3, scale: "1.12" },
  opacity: 0,
  transformBox: "fill-box",
  transformOrigin: "center",
});

const aboutInk = css({
  _groupCurrent: { color: "primary" },
  _groupFocusVisible: { color: "primary" },
  _groupHover: { color: "primary" },
  color: "inherit",
  transitionDuration: "200ms",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const aboutDot = css({
  _groupFocusVisible: {
    animationDuration: "520ms",
    animationName: "icon-drop",
    animationTimingFunction: "spring",
  },
  _groupHover: {
    animationDuration: "520ms",
    animationName: "icon-drop",
    animationTimingFunction: "spring",
  },
  _motionReduce: { animationName: "none" },
  transformBox: "fill-box",
  transformOrigin: "center",
});

const aboutStem = css({
  _groupFocusVisible: {
    animationDuration: "460ms",
    animationName: "icon-grow",
    animationTimingFunction: "air",
  },
  _groupHover: {
    animationDuration: "460ms",
    animationName: "icon-grow",
    animationTimingFunction: "air",
  },
  _motionReduce: { animationName: "none" },
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
