import type { ReactElement } from "react";
import { type IconProps, IconShell } from "./icon";

/*
 * Pagination density marks: 5, 10, 20 and 50 rows per page.
 *
 * The count *is* the content, so the family is bars and nothing else — no outer
 * frame (at 16px inside an option the frame eats the gaps and the glyph reads
 * as a window), no stroke, no motion. The native picker gives options no state
 * we control, and the closed control reuses these marks through `selectedIcon`.
 *
 * Only the count changes between marks, from one shared layout: same bar width,
 * same radius, same optical box, so the four read as a scale rather than as
 * four unrelated glyphs. Fifty breaks the pattern deliberately — five bars at a
 * tighter pitch with a short last bar, which says "many" rather than "four
 * again". Four equal-length lines was the old `AlignJustify`, and at this size
 * that reads as a hamburger menu.
 */

const GRID = 24;
const BAR_X = 4;

interface RowGeometry {
  barHeight: number;
  barWidth: number;
  gap: number;
  lastBarWidth?: number;
  rowCount: number;
}

interface RowBar {
  height: number;
  id: string;
  width: number;
  y: number;
}

const toUnits = (value: number) => Math.round(value * 100) / 100;

const layoutRows = ({
  barHeight,
  barWidth,
  gap,
  lastBarWidth,
  rowCount,
}: RowGeometry): RowBar[] => {
  const stackHeight = barHeight * rowCount + gap * (rowCount - 1);
  const start = (GRID - stackHeight) / 2;

  return Array.from({ length: rowCount }, (_, index) => ({
    height: barHeight,
    id: `bar-${index}`,
    width:
      lastBarWidth !== undefined && index === rowCount - 1
        ? lastBarWidth
        : barWidth,
    y: toUnits(start + index * (barHeight + gap)),
  }));
};

const STANDARD_BARS = { barHeight: 2.4, barWidth: 16, gap: 3.2 } as const;

const TWO_ROWS = layoutRows({ ...STANDARD_BARS, rowCount: 2 });
const THREE_ROWS = layoutRows({ ...STANDARD_BARS, rowCount: 3 });
const FOUR_ROWS = layoutRows({ ...STANDARD_BARS, rowCount: 4 });
const MANY_ROWS = layoutRows({
  barHeight: 1.9,
  barWidth: 16,
  gap: 2.5,
  lastBarWidth: 8,
  rowCount: 5,
});

const RowStack = ({ rows }: { rows: RowBar[] }): ReactElement => (
  <g fill="currentColor" stroke="none">
    {rows.map((row) => (
      <rect
        height={row.height}
        key={row.id}
        rx={row.height / 2}
        width={row.width}
        x={BAR_X}
        y={row.y}
      />
    ))}
  </g>
);

const RowsTwoIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <RowStack rows={TWO_ROWS} />
  </IconShell>
);

const RowsThreeIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <RowStack rows={THREE_ROWS} />
  </IconShell>
);

const RowsFourIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <RowStack rows={FOUR_ROWS} />
  </IconShell>
);

const RowsManyIcon = (props: IconProps): ReactElement => (
  <IconShell {...props}>
    <RowStack rows={MANY_ROWS} />
  </IconShell>
);

export { RowsFourIcon, RowsManyIcon, RowsThreeIcon, RowsTwoIcon };
