import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { ChevronIcon } from "./chevron-icon";

const pathsOf = (icon: ReactElement): string[] => {
  const { container } = render(icon);
  return Array.from(container.querySelectorAll("path")).map(
    (path) => path.getAttribute("d") ?? ""
  );
};

const BARB = /^M[\d.]+ [\d.]+ (?<x>[\d.]+) (?<y>[\d.]+)$/u;
const SHAFT = /^M(?<x>[\d.]+) (?<y>[\d.]+)v(?<length>[\d.]+)$/u;

const tipXOf = (barb: string): number => Number(BARB.exec(barb)?.groups?.x);
const tipYOf = (barb: string): number => Number(BARB.exec(barb)?.groups?.y);

describe("chevron icon", () => {
  it("draws two barbs at rest and adds the shaft for the arrow morph", () => {
    expect(pathsOf(<ChevronIcon />)).toHaveLength(2);
    expect(pathsOf(<ChevronIcon morph="arrow" />)).toHaveLength(3);
  });

  it("mirrors one set of paths, so the directions cannot drift", () => {
    const rest = pathsOf(<ChevronIcon />);

    for (const direction of ["left", "right", "up"] as const) {
      expect(pathsOf(<ChevronIcon direction={direction} />)).toEqual(rest);
    }
  });

  it("turns the direction with a class, not with new geometry", () => {
    const { container: left } = render(<ChevronIcon direction="left" />);
    const { container: right } = render(<ChevronIcon direction="right" />);

    expect(left.querySelector("g")?.getAttribute("class")).not.toBe(
      right.querySelector("g")?.getAttribute("class")
    );
  });

  it("trails three thin speed lines behind the arrow, and only for the arrow", () => {
    const arrow = render(<ChevronIcon morph="arrow" />).container;
    const lines = Array.from(arrow.querySelectorAll("line"));

    expect(lines).toHaveLength(3);
    // Inside the rotating group, so a left pager trails left without new paths.
    expect(arrow.querySelectorAll("svg > g > line")).toHaveLength(3);

    const tail = SHAFT.exec(pathsOf(<ChevronIcon morph="arrow" />)[2] ?? "");
    const tailY = Number(tail?.groups?.y);
    const lengths = lines.map((line) => {
      const [x1, x2, y1, y2] = ["x1", "x2", "y1", "y2"].map((name) =>
        Number(line.getAttribute(name))
      );

      // Thin, squared to the shaft, and behind its tail: air, not geometry.
      expect(line.getAttribute("stroke-width")).toBe("1");
      expect(x1).toBe(x2);
      expect(y2).toBeLessThan(y1);
      expect(y1).toBeLessThan(tailY);

      return y1 - y2;
    });

    // Uneven lengths: three equal bars read as a barcode, not as speed.
    expect(new Set(lengths).size).toBe(3);

    const still = render(<ChevronIcon />).container;
    expect(still.querySelectorAll("line")).toHaveLength(0);
  });

  it("ends the shaft at the barbs' shared tip", () => {
    const [upper, lower, shaft] = pathsOf(<ChevronIcon morph="arrow" />);

    if (!(upper && lower && shaft)) {
      throw new Error("the arrow morph must draw two barbs and a shaft");
    }

    const groups = SHAFT.exec(shaft)?.groups;
    const shaftTipY = Number(groups?.y) + Number(groups?.length);

    expect(tipXOf(upper)).toBeCloseTo(Number(groups?.x), 5);
    expect(tipXOf(lower)).toBeCloseTo(Number(groups?.x), 5);
    expect(tipYOf(upper)).toBeCloseTo(shaftTipY, 5);
    expect(tipYOf(lower)).toBeCloseTo(shaftTipY, 5);
  });
});
