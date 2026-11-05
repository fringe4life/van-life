import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { CheckIcon, CrossIcon, SpinnerIcon } from "./status-icon";

const containerOf = (icon: ReactElement): HTMLElement => render(icon).container;

const pathsOf = (icon: ReactElement): SVGPathElement[] =>
  Array.from(containerOf(icon).querySelectorAll("path"));

interface Ray {
  angle: number;
  inner: number;
  outer: number;
}

const CENTER = 12;

const readRays = (d: string): Ray[] =>
  d
    .split("M")
    .filter(Boolean)
    .map((segment) => {
      const [x1, y1, x2, y2] = (segment.match(/-?[\d.]+/gu) ?? []).map(Number);
      return {
        angle: Math.round(
          ((Math.atan2((y2 ?? 0) - CENTER, (x2 ?? 0) - CENTER) * 180) /
            Math.PI +
            360) %
            360
        ),
        inner: Math.hypot((x1 ?? 0) - CENTER, (y1 ?? 0) - CENTER),
        outer: Math.hypot((x2 ?? 0) - CENTER, (y2 ?? 0) - CENTER),
      };
    });

/** The set, named once so the shared-box assertion cannot skip one. */
const STATUS_GLYPHS = [
  { name: "spinner", node: <SpinnerIcon /> },
  { name: "check", node: <CheckIcon /> },
  { name: "cross", node: <CrossIcon /> },
];

describe("status glyph set", () => {
  it("draws all three on the same box and stroke as the button slot", () => {
    const classNames: string[] = [];
    for (const { node } of STATUS_GLYPHS) {
      const svg = containerOf(node).querySelector("svg");
      if (!svg) {
        throw new Error("expected an svg");
      }
      expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
      // Stroke/fill live on the shared CSS class (#466 C), not attributes.
      expect(svg.getAttribute("stroke-width")).toBeNull();
      expect(svg.getAttribute("fill")).toBeNull();
      classNames.push(svg.getAttribute("class") ?? "");
    }
    expect(new Set(classNames).size).toBe(1);
  });

  it("bursts into six rays instead of a ring a reader would read as a target", () => {
    const [rays] = pathsOf(<SpinnerIcon />);
    const read = readRays(rays?.getAttribute("d") ?? "");

    expect(read).toHaveLength(6);
    // No closed circle anywhere: a ring plus radial marks is a dartboard.
    expect(
      containerOf(<SpinnerIcon />).querySelectorAll("circle")
    ).toHaveLength(1);
    expect(
      containerOf(<SpinnerIcon />)
        .querySelector("circle")
        ?.getAttribute("fill")
    ).not.toBe("none");
  });

  it("alternates ray length so a turn of the burst is visible", () => {
    const [rays] = pathsOf(<SpinnerIcon />);
    const read = readRays(rays?.getAttribute("d") ?? "");

    expect(read).toHaveLength(6);
    for (const ray of read) {
      // Coordinates are rounded to two decimals in the path, so compare in units.
      expect(ray.inner).toBeCloseTo(3.4, 1);
    }

    // Three long, three short, and never two of a kind in a row.
    expect(read.filter((ray) => ray.outer > 8)).toHaveLength(3);
    expect(read.filter((ray) => ray.outer < 8)).toHaveLength(3);
    for (const [index, ray] of read.entries()) {
      const next = read[(index + 1) % read.length];
      expect(next && ray.outer > 8 !== next.outer > 8).toBe(true);
    }
  });

  it("spaces the rays evenly around the spark", () => {
    const [rays] = pathsOf(<SpinnerIcon />);
    const angles = readRays(rays?.getAttribute("d") ?? "")
      .map((ray) => ray.angle)
      .sort((left, right) => left - right);

    for (const [index, angle] of angles.entries()) {
      const next = angles[(index + 1) % angles.length];
      if (next === undefined) {
        throw new Error("expected six angles");
      }
      expect((next - angle + 360) % 360).toBe(60);
    }

    const spark = containerOf(<SpinnerIcon />).querySelector("circle");
    expect(spark?.getAttribute("cx")).toBe("12");
    expect(spark?.getAttribute("cy")).toBe("12");
    expect(spark?.getAttribute("r")).toBe("1.2");
  });

  it("keeps the burst, its rays and its spark in one turning group", () => {
    const group = containerOf(<SpinnerIcon />).querySelector("svg > g");

    expect(group?.querySelectorAll("path")).toHaveLength(1);
    expect(group?.querySelectorAll("circle")).toHaveLength(1);
    expect(group?.getAttribute("class")).toBeTruthy();
  });
});

describe("status glyph answer", () => {
  it("leaves the check complete when no animation runs", () => {
    const [check] = pathsOf(<CheckIcon />);

    expect(pathsOf(<CheckIcon />)).toHaveLength(1);
    expect(check?.getAttribute("pathLength")).toBe("1");
    expect(check?.getAttribute("stroke-dasharray")).toBe("1");
    expect(check?.getAttribute("stroke-dashoffset")).toBe("0");
  });

  it("draws the cross as two mirrored strokes, each complete at rest", () => {
    const [trailing, leading] = pathsOf(<CrossIcon />);
    const read = (path?: SVGPathElement) =>
      (path?.getAttribute("d") ?? "").match(/[\d.]+/gu)?.map(Number) ?? [];

    expect(pathsOf(<CrossIcon />)).toHaveLength(2);

    const first = read(leading);
    const second = read(trailing);
    expect(first).toHaveLength(4);
    expect(second).toHaveLength(4);
    // Mirrored about both axes of the grid: an X, not two parallel lines.
    expect((first[0] ?? 0) + (second[0] ?? 0)).toBeCloseTo(24, 2);
    expect(first[1]).toBeCloseTo(second[1] ?? 0, 2);
    expect((first[2] ?? 0) + (second[2] ?? 0)).toBeCloseTo(24, 2);
    expect(first[3]).toBeCloseTo(second[3] ?? 0, 2);

    for (const path of [trailing, leading]) {
      expect(path?.getAttribute("pathLength")).toBe("1");
      expect(path?.getAttribute("stroke-dashoffset")).toBe("0");
    }
  });

  it("gives the trailing stroke its own delay and the cross its own shake", () => {
    const [trailing, leading] = pathsOf(<CrossIcon />);
    const shake = containerOf(<CrossIcon />).querySelector("svg > g");

    expect(trailing?.getAttribute("class")).not.toBe(
      leading?.getAttribute("class")
    );
    expect(shake?.getAttribute("class")).toBeTruthy();
    // The shake wraps both strokes, so they cannot drift while it runs.
    expect(shake?.querySelectorAll("path")).toHaveLength(2);
  });
});
