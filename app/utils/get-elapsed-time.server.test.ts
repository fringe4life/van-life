import { describe, expect, it } from "bun:test";
import {
  elapsedDaysFromRange,
  formatElapsedDaysLabel,
  rentDurationLabel,
} from "./get-elapsed-time.server";

describe("elapsedDaysFromRange", () => {
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

describe("formatElapsedDaysLabel", () => {
  it("uses singular day for 1", () => {
    expect(formatElapsedDaysLabel(1)).toBe("1 day");
  });

  it("uses plural days otherwise", () => {
    expect(formatElapsedDaysLabel(0)).toBe("0 days");
    expect(formatElapsedDaysLabel(3)).toBe("3 days");
  });
});

describe("rentDurationLabel", () => {
  it("labels inclusive span from rentedAt to rentedTo", () => {
    const rentedAt = new Date("2024-05-01T00:00:00Z");
    const rentedTo = new Date("2024-05-03T00:00:00Z");

    expect(rentDurationLabel(rentedAt, rentedTo)).toBe("3 days");
  });

  it("labels missing bounds as 0 days", () => {
    expect(rentDurationLabel(null, new Date("2024-05-01T00:00:00Z"))).toBe(
      "0 days"
    );
  });
});
