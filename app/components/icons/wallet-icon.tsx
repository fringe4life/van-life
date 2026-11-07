import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Wallet. The long back panel is the hinge — it lifts on `glide` at its left
 * edge, taking `primary` because it is the part that opens — and a coin falls
 * in behind it, squashing on landing. The coin is `glyph.amber`: the only
 * light in the glyph, and the only thing that is not ink.
 *
 * The current route takes the whole outline to `primary` and washes the body,
 * the same way the header glyphs mark the current page. A wash on its own was
 * too quiet to read against the accent pill.
 */

const walletInk = css({
  _cur: { color: "primary" },
  color: "inherit",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const walletBody = css({
  _cur: { fillOpacity: "0.12" },
  fill: "primary",
  fillOpacity: "0",
  transitionDuration: "normal",
  transitionProperty: "fill-opacity",
  transitionTimingFunction: "air",
});

const walletFlap = css({
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-flap-lift",
    animationTimingFunction: "glide",
    color: "primary",
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-flap-lift",
    animationTimingFunction: "glide",
    color: "primary",
  },
  color: "inherit",
  transformBox: "fill-box",
  transformOrigin: "left bottom",
  transitionDuration: "normal",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

const walletCoin = css({
  /*
   * The coin is described twice: the drop animation, and the place it lands.
   * `animation-fill-mode: forwards` used to be the only thing holding it at
   * `opacity: 1`, so once the guard removes the animation under reduced motion
   * the coin vanished while the flap still lifted. The endpoint is stated here
   * so the state survives without its motion.
   */
  _foc: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-coin-drop",
    animationTimingFunction: "glide",
    opacity: "1",
  },
  _hov: {
    animationDuration: "slowest",
    animationFillMode: "forwards",
    animationName: "icon-coin-drop",
    animationTimingFunction: "glide",
    opacity: "1",
  },
  fill: "glyph.amber",
  opacity: "0",
  stroke: "none",
  transformBox: "fill-box",
  transformOrigin: "center bottom",
});

const WalletIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={walletInk}>
      <rect
        className={walletBody}
        height="13.2"
        rx="2.8"
        width="18.4"
        x="2.8"
        y="6.2"
      />
      <path
        className={walletFlap}
        d="M4.2 6.4V5.2a1 1 0 0 1 1-1h13.6a1 1 0 0 1 1 1v1.2"
      />
      <rect height="4" rx="1.6" width="7" x="14.8" y="10.4" />
      <circle className={walletCoin} cx="12" cy="9.4" r="1.35" />
    </g>
  </IconShell>
);

export { WalletIcon };
