import { describe, expect, it } from "bun:test";
import { clampRentalEndToNow } from "./seed-fns";

const MS_PER_DAY = 86_400_000;

describe("clampRentalEndToNow", () => {
  it("clamps to now when rental would still be ongoing", () => {
    const now = new Date("2026-09-06T00:00:00Z");
    const rentedAt = now;
    const end = clampRentalEndToNow(rentedAt, now);

    expect(end.getTime()).toBe(now.getTime());
  });

  it("keeps a historical end date that already passed", () => {
    const now = new Date("2026-09-06T00:00:00Z");
    const rentedAt = new Date(now.getTime() - 60 * MS_PER_DAY);
    const end = clampRentalEndToNow(rentedAt, now);

    expect(end.getTime()).toBeGreaterThan(rentedAt.getTime());
    expect(end.getTime()).toBeLessThanOrEqual(now.getTime());
  });
});
