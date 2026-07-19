import { beforeAll, describe, expect, it, mock } from "bun:test";

const differenceInDays = mock((later: Date, earlier: Date) =>
  Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24))
);

mock.module("date-fns", () => ({
  differenceInDays,
}));

const { elapsedDaysFromRange } = await import("./get-elapsed-time.server");

describe("elapsedDaysFromRange", () => {
  beforeAll(() => {
    differenceInDays.mockClear();
  });

  it("returns 0 when either bound is missing", () => {
    const date = new Date("2024-01-01T00:00:00Z");

    expect(elapsedDaysFromRange(null, date)).toBe(0);
    expect(elapsedDaysFromRange(date, null)).toBe(0);
    expect(elapsedDaysFromRange(undefined, undefined)).toBe(0);
  });

  it("computes inclusive elapsed days from first and last", () => {
    const first = new Date("2024-01-01T00:00:00Z");
    const last = new Date("2024-02-01T00:00:00Z");

    expect(elapsedDaysFromRange(first, last)).toBe(32);
  });

  it("returns 1 when first and last are the same day", () => {
    const day = new Date("2024-05-01T00:00:00Z");

    expect(elapsedDaysFromRange(day, day)).toBe(1);
  });
});
