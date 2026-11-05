import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Four parts, four curves:
 *   wheels   glide      metal, it rolls and settles
 *   body cab spring     sheet and rubber, it gives
 *   rays     air        light, it snaps out and never bounces
 *   beam     springSoft glow blooming
 *
 * Only the moving parts take hue: the wheels and rays go `primary`, the beam
 * goes `warmAmber.400`, and every static stroke stays `currentColor`.
 *
 * Reduced motion for this glyph:
 *
 *   1. `theme/global-styles.ts` drops every SVG animation under reduce.
 *   2. Each interactive state carries its *end appearance* as a plain
 *      declaration (`opacity: 1` on the rays, `0.6` on the beam) so the look
 *      survives without the keyframe. Keyframes only animate toward that look.
 *
 * Nested `_red` inside a state (`_hov: { _red: { … } }`) is valid and is what
 * siblings like chevron/star use when they need a same-weight cancel. What
 * fails is a *top-level* `_red` that resets colour/opacity without a state
 * prefix — that can light an idle glyph on every route (#460). This file
 * needs neither form: the global guard plus explicit end-states are enough.
 */

const vanWheel = css({
  _cur: {
    animationDuration: "1.9s",
    animationIterationCount: "infinite",
    animationName: "icon-spin",
    animationTimingFunction: "linear",
    color: "primary",
  },
  _foc: {
    animationDuration: "1s",
    animationName: "icon-spin",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "1s",
    animationName: "icon-spin",
    animationTimingFunction: "glide",
    color: "primary",
  },
  color: "inherit",
  transformBox: "fill-box",
  transformOrigin: "center",
});

const vanRays = css({
  _cur: {
    animationDuration: "1.5s",
    animationIterationCount: "infinite",
    animationName: "van-ray-drift",
    animationTimingFunction: "linear",
    color: "primary",
    opacity: 1,
  },
  _foc: {
    animationDuration: "slower",
    animationFillMode: "forwards",
    animationName: "van-ray-out",
    animationTimingFunction: "air",
    color: "primary",
    opacity: 1,
  },
  _hov: {
    animationDuration: "slower",
    animationFillMode: "forwards",
    animationName: "van-ray-out",
    animationTimingFunction: "air",
    color: "primary",
    opacity: 1,
  },
  color: "inherit",
  opacity: 0,
});

const vanBeam = css({
  _cur: {
    animationDuration: "3.2s",
    animationIterationCount: "infinite",
    animationName: "van-beam-breathe",
    animationTimingFunction: "ease-in-out",
    opacity: 0.6,
  },
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "van-beam-in",
    animationTimingFunction: "springSoft",
    opacity: 0.6,
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "van-beam-in",
    animationTimingFunction: "springSoft",
    opacity: 0.6,
  },
  fill: "warmAmber.400",
  opacity: 0,
  transformBox: "fill-box",
  transformOrigin: "left center",
});

const vanCab = css({
  _cur: { fill: "primary", fillOpacity: 0.34 },
  _foc: { fill: "primary", fillOpacity: 0.34 },
  _hov: { fill: "primary", fillOpacity: 0.34 },
  fill: "transparent",
  transitionDuration: "normal",
  transitionProperty: "fill",
  transitionTimingFunction: "air",
});

const vanSquish = css({
  _cur: {
    animationDuration: "2.4s",
    animationIterationCount: "infinite",
    animationName: "van-idle",
    animationTimingFunction: "ease-in-out",
  },
  _foc: {
    animationDuration: "slowest",
    animationName: "van-squish",
    animationTimingFunction: "spring",
  },
  _hov: {
    animationDuration: "slowest",
    animationName: "van-squish",
    animationTimingFunction: "spring",
  },
  transformBox: "fill-box",
  transformOrigin: "center bottom",
});

const VanIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={vanRays}>
      <line x1="0.4" x2="2.3" y1="11.2" y2="11.2" />
      <line x1="0.2" x2="2.5" y1="13.9" y2="13.9" />
      <line x1="0.6" x2="2.1" y1="16.6" y2="16.6" />
    </g>
    <path className={vanBeam} d="M19.9 12.2 24 10.4V14Z" />
    <path className={vanCab} d="M13 8.6h2.6l4.3 2.9v5.1H13z" />
    <path className={vanSquish} d="M2.8 16.6V8.6h12.8l4.3 2.9v5.1z" />
    <path d="M6.4 8.6V6.4h5.8v2.2" />
    <path d="M4.6 10.3h3.5v3.1H4.6z" />
    <g className={vanWheel}>
      <path d="M8 16.05A1.95 1.95 0 1 1 6.08 18.34" />
      <circle cx="8" cy="18" fill="currentColor" r="0.5" stroke="none" />
    </g>
    <g className={vanWheel}>
      <path d="M16.4 16.05A1.95 1.95 0 1 1 14.48 18.34" />
      <circle cx="16.4" cy="18" fill="currentColor" r="0.5" stroke="none" />
    </g>
  </IconShell>
);

export { VanIcon };
