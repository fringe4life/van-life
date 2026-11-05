import type { ReactElement } from "react";
import { css, cx } from "styled-system/css";
import { type IconProps, IconShell } from "./icon";

/*
 * One chevron for every surface that needs one (#458): the host mobile trigger
 * (#443), the pagination arrows (#432 / #433) and — once its arrow is ours — the
 * limit select. Before this, three copies existed with three different
 * geometries and one hard-coded hex in a data URI.
 *
 * Drawn as two barb paths plus an optional shaft, not one path: a barb has to be
 * able to pivot toward the shaft on its own, and a shaft has to be able to
 * appear, and a single-path chevron can do neither. The barbs are computed from
 * one `BARB_LENGTH` at 45°, so the chevron and the arrow in
 * `arrow-right-icon.tsx` share a shoulder length and cannot drift apart.
 *
 * Direction is a literal class per value, never a computed inline transform:
 * Panda extracts styles statically, so a transform built from a prop would emit
 * a class with no rule behind it (see `docs/icon-packs.md`).
 *
 * Two tip positions, both centred in their own optical box: the plain chevron
 * sits on the grid centre, the shafted one shifts down so that the shaft's
 * overhang does not push the glyph north of centre. The arrow keeps the shafted
 * tip at rest too — otherwise the head would jump on every hover.
 *
 * `morph="arrow"` is pagination's gesture: the barbs swing 15° each towards the
 * shaft, closing the point from 90° to 60°, while the shaft grows out of the
 * tip. The owning element carries `group` (the pager buttons already do), so the
 * glyph reads hover and focus-visible from an ancestor instead of a React flag.
 * Geometry only — `arrowRecipe` still owns the glyph's colour and travel.
 *
 * The speed lines are the pager's press answer (#432 / #433), and they are the
 * van's pulse — three lines leaving the vehicle — rebuilt for a gesture rather
 * than an idle route. Longer (3.2 – 4.4 units against the van's 2.1) and thinner
 * (stroke 1), because a streak should read as light, not as a second arrow; they
 * fire 30ms apart so the burst accelerates instead of shimmering; and the whole
 * arrow takes a 9% stretch along its travel with them, which is the cheapest
 * honest way to say "this thing is moving". They are held by
 * `data-pulse` on the pager button, not by `:active`, because a press is over
 * long before the eye has read it.
 */

type ChevronDirection = "down" | "left" | "right" | "up";

/** The only shape change this glyph knows. Pagination is the only caller. */
type ChevronMorph = "arrow";

const BARB_LENGTH = 8;
const GRID_CENTER = 12;
const PLAIN_TIP_Y = 14.9;
const SHAFTED_TIP_Y = 16.55;
const HALF_TURN = 45;

const toUnits = (value: number): number => Math.round(value * 100) / 100;

interface ChevronPaths {
  lower: string;
  shaft: string;
  upper: string;
}

const buildChevron = (tipY: number): ChevronPaths => {
  const setback = toUnits(BARB_LENGTH * Math.cos((HALF_TURN * Math.PI) / 180));
  const shoulderY = toUnits(tipY - setback);
  const shaftTop = toUnits(GRID_CENTER - (tipY - GRID_CENTER));

  return {
    lower: `M${toUnits(GRID_CENTER + setback)} ${shoulderY} ${GRID_CENTER} ${tipY}`,
    shaft: `M${GRID_CENTER} ${shaftTop}v${toUnits(tipY - shaftTop)}`,
    upper: `M${toUnits(GRID_CENTER - setback)} ${shoulderY} ${GRID_CENTER} ${tipY}`,
  };
};

const PLAIN_PATHS = buildChevron(PLAIN_TIP_Y);
const SHAFTED_PATHS = buildChevron(SHAFTED_TIP_Y);

const chevronBody = css({
  /*
   * Travel is the glyph's own Y — the direction class turns the body, so the
   * stretch is applied before the rotation and lands along the arrow's axis.
   * The 9% elongation against a 5% squeeze is what reads as speed; an even
   * scale would just look bigger.
   */
  _pul: {
    _red: { scale: "1 1" },
    color: "primary",
    scale: "1.09 0.95",
  },
  transformBox: "view-box",
  transformOrigin: "center",
  transitionDuration: "normal",
  transitionProperty: "color,scale",
  transitionTimingFunction: "glide",
});

const directionClassName = {
  down: css({ rotate: "0deg" }),
  left: css({ rotate: "90deg" }),
  right: css({ rotate: "-90deg" }),
  up: css({ rotate: "180deg" }),
} as const;

/*
 * Origins are percentages on each barb's own box, not user-unit tip
 * coordinates: a `fill-box` origin survives a change to `BARB_LENGTH` or the
 * tip, where a literal `12px 16.55px` would silently drift out of view of the
 * extractor. The upper barb's tip is its bottom-left corner, the lower barb's
 * is its bottom-right.
 *
 * The reduced-motion reset sits inside each group condition rather than at the
 * top level: `.group:hover .barb` is two classes, so a one-class `@media` reset
 * would lose the cascade and the barbs would still swing. Under reduce the
 * point stays open and only the colour changes.
 */
const barbUpperMorph = css({
  _foc: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "15deg",
  },
  _groupDisabled: {
    rotate: "0deg !important",
    transitionDuration: "0s",
  },
  _hov: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "15deg",
  },
  /* Press closes the point too: on a touch pager there is no hover to do it. */
  _pul: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "15deg",
  },
  rotate: "0deg",
  transformBox: "fill-box",
  transformOrigin: "0% 100%",
  transitionDuration: "normal",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

const barbLowerMorph = css({
  _foc: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "-15deg",
  },
  _groupDisabled: {
    rotate: "0deg !important",
    transitionDuration: "0s",
  },
  _hov: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "-15deg",
  },
  _pul: {
    _red: { rotate: "0deg", transitionDuration: "0s" },
    rotate: "-15deg",
  },
  rotate: "0deg",
  transformBox: "fill-box",
  transformOrigin: "100% 100%",
  transitionDuration: "normal",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

/*
 * The shaft is the vertical source that the direction class turns horizontal,
 * so it grows along its own Y from the tip (bottom end) rather than the issue's
 * X. Starting at `scaleY 0.35` keeps the round cap at the tip from popping in as
 * a dot. Reduced motion still reveals it — a shaft appearing instantly is not
 * movement — it just skips the 240ms.
 */
const shaftReveal = css({
  _foc: {
    _red: { opacity: "1", scale: "1 1", transitionDuration: "0s" },
    opacity: "1",
    scale: "1 1",
  },
  _groupDisabled: {
    opacity: "0 !important",
    scale: "1 0.35 !important",
    transitionDuration: "0s",
  },
  _hov: {
    _red: { opacity: "1", scale: "1 1", transitionDuration: "0s" },
    opacity: "1",
    scale: "1 1",
  },
  /* In flight the shaft is out — a streak trail behind a bare chevron reads as
   * debris rather than as an arrow, especially on a touch pager with no hover. */
  _pul: {
    _red: { opacity: "1", scale: "1 1", transitionDuration: "0s" },
    opacity: "1",
    scale: "1 1",
  },
  opacity: "0",
  scale: "1 0.35",
  transformBox: "fill-box",
  transformOrigin: "50% 100%",
  transitionDuration: "normal",
  transitionProperty: "opacity,scale",
  transitionTimingFunction: "glide",
});

/*
 * Speed lines. They start just behind the shaft's tail and run outward, so they
 * read as air the arrow has already gone through rather than as decoration
 * around it. Lengths are deliberately uneven — three equal lines look like a
 * barcode; three different ones look like a moment.
 */
const STREAK_TAIL_Y = 6.7;
const STREAK_STROKE = 1;

/*
 * `transformOrigin` at the bottom: a streak grows out of the arrow rather than
 * up from nowhere, and travels while it thins — stretch without travel reads as
 * a scale, travel without stretch reads as a slide.
 *
 * The animation itself is one class; only the delay is per line, and a delay
 * only matters while an animation is running, so it needs no condition. Three
 * lines firing on the same frame shimmer — 28ms apart, they burst.
 */
const streakPulse = css({
  _pul: {
    _red: { animationName: "none", opacity: "0.65" },
    animationDuration: "slowest",
    animationIterationCount: "infinite",
    animationName: "page-streak",
    animationTimingFunction: "air",
    opacity: "1",
  },
  opacity: "0",
  transformBox: "fill-box",
  transformOrigin: "50% 100%",
});

const streakFirst = css({ animationDelay: "0ms" });
const streakSecond = css({ animationDelay: "28ms" });
const streakThird = css({ animationDelay: "56ms" });

/**
 * The centre line goes first, the flanks follow: one streak leading two is what
 * makes it read as something shooting off, rather than as a set of bars.
 */
const STREAKS = [
  { delayClassName: streakSecond, length: 3.2, x: 8.9 },
  { delayClassName: streakFirst, length: 4.4, x: 12 },
  { delayClassName: streakThird, length: 3.7, x: 15.1 },
] as const;

interface ChevronIconProps extends IconProps {
  /** Which way the chevron points. A literal class per value. */
  direction?: ChevronDirection;
  /**
   * `"arrow"` draws the shaft hidden at rest and lets the owning `group` close
   * the barbs and grow the shaft on hover and focus-visible. Omit it for a
   * still chevron: the host trigger and the select never ask for the morph.
   */
  morph?: ChevronMorph;
}

const ChevronIcon = ({
  className,
  direction = "down",
  morph,
  size,
  ...rest
}: ChevronIconProps): ReactElement => {
  const isArrow = morph === "arrow";
  const paths = isArrow ? SHAFTED_PATHS : PLAIN_PATHS;

  return (
    <IconShell className={className} size={size} {...rest}>
      <g className={cx(chevronBody, directionClassName[direction])}>
        <path
          className={isArrow ? barbUpperMorph : undefined}
          d={paths.upper}
        />
        <path
          className={isArrow ? barbLowerMorph : undefined}
          d={paths.lower}
        />
        {isArrow ? <path className={shaftReveal} d={paths.shaft} /> : null}
        {isArrow
          ? STREAKS.map(({ delayClassName, length, x }) => (
              <line
                className={cx(streakPulse, delayClassName)}
                key={x}
                strokeWidth={STREAK_STROKE}
                x1={x}
                x2={x}
                y1={STREAK_TAIL_Y}
                y2={toUnits(STREAK_TAIL_Y - length)}
              />
            ))
          : null}
      </g>
    </IconShell>
  );
};

export type { ChevronDirection, ChevronIconProps, ChevronMorph };
export { BARB_LENGTH, ChevronIcon };
