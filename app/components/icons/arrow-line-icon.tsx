import type { ReactElement } from "react";
import { type IconProps, IconShell } from "./icon";
import { moneyInflow, moneyOutflow } from "./money-ink";

/*
 * Money onto a line and money off it: DEPOSIT (#439) and WITHDRAW (#442).
 *
 * One geometry, mirrored about the grid centre, so the pair cannot drift in
 * stroke weight, line inset or the gap between the arrow and the line. The line
 * is the ledger, the arrow is the movement, and only the arrow wears the
 * direction tint — the line stays `currentColor`, which is the badge's text
 * colour.
 *
 * Static by design: the badge sits in a card that is not a link, the glyph is
 * 14px, and the card already reveals itself on scroll. Colour is the only
 * channel left, and the card's rail already reads the same direction.
 */

type LineArrowDirection = "down" | "up";

const GRID = 24;
const GRID_CENTER = GRID / 2;
/** The line runs between these insets, so both ends keep the same margin. */
const LINE_INSET = 4;
/** Baseline for the deposit glyph; withdrawal mirrors it to `GRID - LINE_Y`. */
const LINE_Y = 19;
const SHAFT_START_Y = 4.5;
const TIP_Y = 15.5;
const SHOULDER_Y = 12;
const SHOULDER_X = 3.5;

const round = (value: number): number => Math.round(value * 100) / 100;

interface LineArrowPaths {
  head: string;
  line: string;
  shaft: string;
}

const buildLineArrow = (direction: LineArrowDirection): LineArrowPaths => {
  const onGrid = (y: number): number =>
    round(direction === "down" ? y : GRID - y);
  const tip = onGrid(TIP_Y);

  return {
    head: `M${GRID_CENTER - SHOULDER_X} ${onGrid(SHOULDER_Y)} ${GRID_CENTER} ${tip} ${GRID_CENTER + SHOULDER_X} ${onGrid(SHOULDER_Y)}`,
    line: `M${LINE_INSET} ${onGrid(LINE_Y)}H${GRID - LINE_INSET}`,
    shaft: `M${GRID_CENTER} ${onGrid(SHAFT_START_Y)}V${tip}`,
  };
};

const DOWN_PATHS = buildLineArrow("down");
const UP_PATHS = buildLineArrow("up");

/** Shaft and head carry the tint; the baseline is the only untinted path. */
const LineArrowBody = ({
  direction,
}: {
  direction: LineArrowDirection;
}): ReactElement => {
  const paths = direction === "down" ? DOWN_PATHS : UP_PATHS;

  return (
    <>
      <g className={direction === "down" ? moneyInflow : moneyOutflow}>
        <path d={paths.shaft} />
        <path d={paths.head} />
      </g>
      <path d={paths.line} />
    </>
  );
};

const ArrowDownToLineIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <LineArrowBody direction="down" />
  </IconShell>
);

const ArrowUpFromLineIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <LineArrowBody direction="up" />
  </IconShell>
);

export { ArrowDownToLineIcon, ArrowUpFromLineIcon };
