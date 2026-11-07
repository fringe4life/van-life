import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Rentals. Two arrows trading places: each one travels the way its own head
 * points — top to the right, bottom to the left — so the glyph reads as an
 * exchange rather than as a carousel. Both heads stay welded to their shafts,
 * so shaft and head are one group and the group is what moves.
 *
 * Hover is a transition, not a beat: the arrows settle out and come back when
 * the pointer leaves. On the current route they keep a 3s sway of 1.6px, and
 * the current selector is authored last so a hovered current item keeps it.
 */

const rentalsInk = css({
  _cur: { color: "primary" },
  _foc: { color: "primary" },
  _hov: { color: "primary" },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const outboundArrow = css({
  _cur: {
    animationDuration: "3s",
    animationIterationCount: "infinite",
    animationName: "icon-exchange-right",
    animationTimingFunction: "linear",
  },
  /* Travel is the gesture here, so reduced motion keeps the arrows home; the
   * cancel sits inside each state rather than in a bare top-level rule. */
  _foc: {
    _red: { translate: "0 0" },
    translate: "2.4px 0",
  },
  _hov: { _red: { translate: "0 0" }, translate: "2.4px 0" },
  transitionDuration: "slower",
  transitionProperty: "translate",
  transitionTimingFunction: "glide",
});

const returnArrow = css({
  _cur: {
    animationDuration: "3s",
    animationIterationCount: "infinite",
    animationName: "icon-exchange-left",
    animationTimingFunction: "linear",
  },
  _foc: {
    _red: { translate: "0 0" },
    translate: "-2.4px 0",
  },
  _hov: { _red: { translate: "0 0" }, translate: "-2.4px 0" },
  transitionDuration: "slower",
  transitionProperty: "translate",
  transitionTimingFunction: "glide",
});

const RentalsIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={rentalsInk}>
      <g className={outboundArrow}>
        <path d="M3.4 8.4h17" />
        <path d="M16.8 4.9 20.4 8.4 16.8 11.9" />
      </g>
      <g className={returnArrow}>
        <path d="M20.6 15.6H3.6" />
        <path d="M7.2 12.1 3.6 15.6 7.2 19.1" />
      </g>
    </g>
  </IconShell>
);

export { RentalsIcon };
