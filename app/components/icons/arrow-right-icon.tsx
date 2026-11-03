import type { ReactElement } from "react";
import { css } from "styled-system/css";
import { BARB_LENGTH } from "./chevron-icon";
import { type IconProps, IconShell } from "./icon";

/*
 * Arrows that lead somewhere. Two seats today, both real links: the wallet
 * ledger link and the reviews link on the dashboard summary band (#459).
 *
 * Shaft plus two barbs, the same shoulder length as `chevron-icon.tsx` — one
 * mechanic for the whole family, so the dashboard arrow and the pagination
 * arrows cannot end up as two different ideas of "arrow".
 *
 * The response is a push, not a bounce: the barbs close toward the shaft while
 * the glyph travels, so the head reads as being driven into the direction it
 * points rather than the whole mark sliding as a block.
 *
 * Two extraction hazards are handled literally here. Every value inside a
 * `css()` call is written out — a module constant or a factory argument reaches
 * the class name but never the stylesheet (see `log-in-icon.tsx`). And the
 * reduced-motion reset is nested *inside* each group condition instead of
 * sitting at the top level: the group selectors are `.group:hover .glyph` at two
 * classes, so a top-level `@media` reset at one class loses the cascade and the
 * arrow would keep moving under `prefers-reduced-motion`.
 */

const round = (value: number): number => Math.round(value * 100) / 100;

/* 37° off the shaft is a 74° included angle; closing 10° a side gives 54°. */
const RISE = round(BARB_LENGTH * Math.sin((37 * Math.PI) / 180));
const RUN = round(BARB_LENGTH * Math.cos((37 * Math.PI) / 180));

const UPPER_BARB = `M${round(20.2 - RUN)} ${round(12 - RISE)} 20.2 12`;
const LOWER_BARB = `M${round(20.2 - RUN)} ${round(12 + RISE)} 20.2 12`;
const SHAFT = `M3.9 12h${round(20.2 - 3.9)}`;

const arrowBody = css({
  _groupFocusVisible: {
    _motionReduce: { translate: "0 0" },
    translate: "1.6px 0",
  },
  _groupHover: {
    _motionReduce: { translate: "0 0" },
    translate: "1.6px 0",
  },
  transformBox: "view-box",
  transformOrigin: "center",
  transitionDuration: "220ms",
  transitionProperty: "translate",
  transitionTimingFunction: "glide",
});

/* Closing toward the shaft is clockwise for the upper barb, counter for the lower. */
const barbUpper = css({
  _groupFocusVisible: {
    _motionReduce: { rotate: "0deg" },
    rotate: "10deg",
  },
  _groupHover: {
    _motionReduce: { rotate: "0deg" },
    rotate: "10deg",
  },
  rotate: "0deg",
  transformBox: "view-box",
  transformOrigin: "20.2px 12px",
  transitionDuration: "220ms",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

const barbLower = css({
  _groupFocusVisible: {
    _motionReduce: { rotate: "0deg" },
    rotate: "-10deg",
  },
  _groupHover: {
    _motionReduce: { rotate: "0deg" },
    rotate: "-10deg",
  },
  rotate: "0deg",
  transformBox: "view-box",
  transformOrigin: "20.2px 12px",
  transitionDuration: "220ms",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

const ArrowRightIcon = ({
  className,
  size,
  ...rest
}: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <g className={arrowBody}>
      <path className={barbUpper} d={UPPER_BARB} />
      <path className={barbLower} d={LOWER_BARB} />
      <path d={SHAFT} />
    </g>
  </IconShell>
);

export { ArrowRightIcon };
