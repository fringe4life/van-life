import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MoneyInIcon, MoneyOutIcon } from "./money-transfer-icon";

const SHAFT =
  /^M(?<startX>[\d.]+) (?<startY>[\d.]+) (?<endX>[\d.]+) (?<endY>[\d.]+)$/u;
const HEAD = /^M(?<x1>[\d.]+) (?<y1>[\d.]+)H(?<x2>[\d.]+)V(?<y2>[\d.]+)$/u;

const pathsOf = (icon: ReactElement): string[] => {
  const { container } = render(icon);
  return Array.from(container.querySelectorAll("path")).map(
    (path) => path.getAttribute("d") ?? ""
  );
};

interface DirectionArrow {
  headCorner: { x: number; y: number };
  shaft: { endX: number; endY: number; startX: number; startY: number };
}

const readArrow = (icon: ReactElement): DirectionArrow => {
  const [shaft, head] = [
    SHAFT.exec(pathsOf(icon)[0] ?? ""),
    HEAD.exec(pathsOf(icon)[1] ?? ""),
  ];

  if (!(shaft?.groups && head?.groups)) {
    throw new Error("expected a shaft path and a head path");
  }

  return {
    headCorner: {
      x: Number(head.groups.x2),
      y: Number(head.groups.y1),
    },
    shaft: {
      endX: Number(shaft.groups.endX),
      endY: Number(shaft.groups.endY),
      startX: Number(shaft.groups.startX),
      startY: Number(shaft.groups.startY),
    },
  };
};

describe("money direction arrow", () => {
  it("gives the whole glyph to the direction tint", () => {
    const { container } = render(<MoneyOutIcon />);

    expect(container.querySelectorAll("svg path")).toHaveLength(2);
    expect(container.querySelectorAll("svg > g > path")).toHaveLength(2);
    expect(container.querySelector("svg > path")).toBeNull();
    expect(container.querySelector("rect")).toBeNull();
  });

  it("keeps one shaft and moves only the head", () => {
    const received = readArrow(<MoneyInIcon />);
    const sent = readArrow(<MoneyOutIcon />);

    expect(pathsOf(<MoneyInIcon />)[0]).toBe(pathsOf(<MoneyOutIcon />)[0]);
    expect(received.shaft).toEqual(sent.shaft);
    expect(pathsOf(<MoneyInIcon />)[1]).not.toBe(pathsOf(<MoneyOutIcon />)[1]);
  });

  it("puts the head at opposite ends of the shaft", () => {
    const received = readArrow(<MoneyInIcon />);
    const sent = readArrow(<MoneyOutIcon />);

    expect(sent.headCorner.x).toBeCloseTo(sent.shaft.endX, 5);
    expect(sent.headCorner.y).toBeCloseTo(sent.shaft.endY, 5);
    expect(received.headCorner.x).toBeCloseTo(received.shaft.startX, 5);
    expect(received.headCorner.y).toBeCloseTo(received.shaft.startY, 5);
  });
});
