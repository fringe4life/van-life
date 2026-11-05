import { css } from "styled-system/css";

/*
 * Biome 2.6+ CSS-in-JS parse rejects `var(--token)` string literals inside
 * style objects. Keep the value in a plain const; biome-ignore cannot suppress
 * parse diagnostics.
 */
const hamburgerTransitionDuration = "var(--duration-dialog)";

const hamburgerBarBase = css({
  _hmb: {
    _starting: {
      rotate: "0",
      translate: "0",
    },
  },
  transformOrigin: "center",
  transitionDuration: hamburgerTransitionDuration,
  transitionProperty: "translate,rotate",
  transitionTimingFunction: "ease-spring",
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `hamburgerBar({ position })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const hamburgerBarByPosition = {
  bottom: css({
    _hmb: {
      rotate: "-45deg",
      translate: "0 -2px",
    },
  }),
  top: css({
    _hmb: {
      rotate: "45deg",
      translate: "0 4px",
    },
  }),
} as const;

interface HamburgerIconProps {
  className?: string;
  size?: number;
}

/**
 * Two bars morph to an X while the mobile-nav dialog is open.
 *
 * `group-has-open/hamburger` is enough for both icons: outer
 * `.group/hamburger` `:has([open])` matches open-button (sibling of dialog)
 * and close-button (inside dialog). No `group-open/mobile-nav` on the bars.
 *
 * Close icon first-paints inside an already-open dialog, so
 * `starting:rotate-0 starting:translate-y-0` give a bars frame to ease from.
 *
 * Transform math (SVG user units — `4px` on SVG children maps to 4 viewBox
 * units, so any rendered `size` stays correct):
 *   viewBox 24×24; top y=8, bottom y=16, centre y=12.
 *   Independent `translate` then `rotate`: each line moves 4 units onto the
 *   centre, then ±45° about view-box centre (12,12).
 */

const HamburgerIcon = ({ size = 20, className }: HamburgerIconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size}
  >
    <line
      className={`${hamburgerBarBase} ${hamburgerBarByPosition.top}`}
      x1="3"
      x2="21"
      y1="8"
      y2="8"
    />
    <line
      className={`${hamburgerBarBase} ${hamburgerBarByPosition.bottom}`}
      x1="3"
      x2="21"
      y1="16"
      y2="16"
    />
  </svg>
);

export { HamburgerIcon };
