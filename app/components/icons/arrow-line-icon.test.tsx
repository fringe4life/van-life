import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { ArrowDownToLineIcon, ArrowUpFromLineIcon } from "./arrow-line-icon";

const GRID = 24;

const pathsOf = (icon: ReactElement): string[] => {
  const { container } = render(icon);
  return Array.from(container.querySelectorAll("path")).map(
    (path) => path.getAttribute("d") ?? ""
  );
};

const LINE = /^M(?<left>[\d.]+) (?<lineY>[\d.]+)H(?<right>[\d.]+)$/u;
const SHAFT = /^M(?<x>[\d.]+) (?<start>[\d.]+)V(?<tip>[\d.]+)$/u;

interface LineArrow {
  leftInset: number;
  lineY: number;
  rightInset: number;
  shaftStart: number;
  shaftTip: number;
}

/** Path order is shaft, head, baseline — see `LineArrowBody`. */
const readLineArrow = (icon: ReactElement): LineArrow => {
  const [shaft, , line] = pathsOf(icon);
  const shaftMatch = SHAFT.exec(shaft ?? "");
  const lineMatch = LINE.exec(line ?? "");

  if (!(shaftMatch?.groups && lineMatch?.groups)) {
    throw new Error("expected a shaft path and a baseline path");
  }

  return {
    leftInset: Number(lineMatch.groups.left),
    lineY: Number(lineMatch.groups.lineY),
    rightInset: Number(lineMatch.groups.right),
    shaftStart: Number(shaftMatch.groups.start),
    shaftTip: Number(shaftMatch.groups.tip),
  };
};

describe("arrow to line family", () => {
  it("draws the tinted pair separately from the baseline", () => {
    const { container } = render(<ArrowDownToLineIcon />);

    expect(container.querySelectorAll("svg > g > path")).toHaveLength(2);
    expect(container.querySelectorAll("svg > path")).toHaveLength(1);
    expect(pathsOf(<ArrowUpFromLineIcon />)).toHaveLength(3);
  });

  it("keeps the same arrow-to-line gap in both directions", () => {
    const deposit = readLineArrow(<ArrowDownToLineIcon />);
    const withdraw = readLineArrow(<ArrowUpFromLineIcon />);

    expect(deposit.lineY - deposit.shaftTip).toBeCloseTo(
      withdraw.shaftTip - withdraw.lineY,
      5
    );
  });

  it("mirrors about the grid centre instead of drifting", () => {
    const deposit = readLineArrow(<ArrowDownToLineIcon />);
    const withdraw = readLineArrow(<ArrowUpFromLineIcon />);

    expect(deposit.lineY + withdraw.lineY).toBeCloseTo(GRID, 5);
    expect(deposit.shaftStart + withdraw.shaftStart).toBeCloseTo(GRID, 5);
    expect(deposit.shaftTip + withdraw.shaftTip).toBeCloseTo(GRID, 5);
    expect(deposit.leftInset).toBe(withdraw.leftInset);
    expect(deposit.rightInset).toBe(withdraw.rightInset);
  });

  it("moves the arrow toward and away from its own line", () => {
    const deposit = readLineArrow(<ArrowDownToLineIcon />);
    const withdraw = readLineArrow(<ArrowUpFromLineIcon />);

    expect(deposit.shaftTip).toBeGreaterThan(deposit.shaftStart);
    expect(withdraw.shaftTip).toBeLessThan(withdraw.shaftStart);
  });
});
