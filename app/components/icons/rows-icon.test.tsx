import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import {
  RowsFourIcon,
  RowsManyIcon,
  RowsThreeIcon,
  RowsTwoIcon,
} from "./rows-icon";

interface Bar {
  height: number;
  width: number;
  y: number;
}

const barsOf = (icon: ReactElement): Bar[] => {
  const { container } = render(icon);
  return Array.from(container.querySelectorAll("rect")).map((rect) => ({
    height: Number(rect.getAttribute("height")),
    width: Number(rect.getAttribute("width")),
    y: Number(rect.getAttribute("y")),
  }));
};

/** Vertical gap between consecutive bars. */
const gapOf = (bars: Bar[]): number =>
  bars.length > 1 ? bars[1].y - bars[0].y - bars[0].height : 0;

const STANDARD_FAMILY = [
  { count: 2, Icon: RowsTwoIcon },
  { count: 3, Icon: RowsThreeIcon },
  { count: 4, Icon: RowsFourIcon },
] as const;

describe("rows icon family", () => {
  for (const { count, Icon } of STANDARD_FAMILY) {
    it(`draws ${count} equal bars at the family pitch`, () => {
      const drawn = barsOf(<Icon />);

      expect(drawn).toHaveLength(count);
      expect(gapOf(drawn)).toBeCloseTo(3.2, 5);
      for (const bar of drawn) {
        expect(bar.height).toBeCloseTo(2.4, 5);
        expect(bar.width).toBe(16);
        expect(bar.y).toBeGreaterThanOrEqual(0);
        expect(bar.y + bar.height).toBeLessThanOrEqual(24);
      }
    });
  }

  it("reads fifty as five tight bars ending short", () => {
    const drawn = barsOf(<RowsManyIcon />);

    expect(drawn).toHaveLength(5);
    expect(gapOf(drawn)).toBeCloseTo(2.5, 5);
    expect(drawn.slice(0, -1).every((bar) => bar.width === 16)).toBe(true);
    expect(drawn.at(-1)?.width).toBe(8);
    const last = drawn.at(-1);
    expect((last?.y ?? 0) + (last?.height ?? 0)).toBeLessThanOrEqual(24);
  });

  it("fills with the current colour and does not stroke", () => {
    const { container } = render(<RowsTwoIcon />);
    const bars = Array.from(container.querySelectorAll("rect"));

    expect(bars).toHaveLength(2);
    for (const bar of bars) {
      expect(Number(bar.getAttribute("rx"))).toBeCloseTo(1.2, 5);
    }

    // The group carries the paint so the bars cannot pick up the shell's
    // `stroke="currentColor"` and outline themselves at 1.6.
    const group = bars[0]?.parentElement;
    expect(group?.getAttribute("fill")).toBe("currentColor");
    expect(group?.getAttribute("stroke")).toBe("none");
  });
});
