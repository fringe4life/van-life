import { cva } from "cva";

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
const hamburgerBar = cva({
  base: "transform-view origin-center transition-[translate,rotate] duration-(--duration-dialog) ease-spring group-has-open/hamburger:starting:translate-y-0 group-has-open/hamburger:starting:rotate-0",
  variants: {
    position: {
      bottom:
        "group-has-open/hamburger:-translate-y-[2px] group-has-open/hamburger:-rotate-45",
      top: "group-has-open/hamburger:translate-y-[4px] group-has-open/hamburger:rotate-45",
    },
  },
});

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
      className={hamburgerBar({ position: "top" })}
      x1="3"
      x2="21"
      y1="8"
      y2="8"
    />
    <line
      className={hamburgerBar({ position: "bottom" })}
      x1="3"
      x2="21"
      y1="16"
      y2="16"
    />
  </svg>
);

export { HamburgerIcon };
