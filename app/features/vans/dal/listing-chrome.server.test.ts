import { describe, expect, it } from "bun:test";
import { VanState } from "~/db/enums";
import {
  listingChromeFromRow,
  newnessCutoffUtc,
} from "./listing-chrome.server";

describe("newnessCutoffUtc", () => {
  it("subtracts six UTC calendar months", () => {
    const now = new Date("2026-07-31T12:00:00.000Z");
    expect(newnessCutoffUtc(now).toISOString()).toBe(
      "2026-01-31T12:00:00.000Z"
    );
  });

  it.each([
    ["2026-08-29T12:00:00.000Z", "2026-02-28T12:00:00.000Z"],
    ["2026-08-30T12:00:00.000Z", "2026-02-28T12:00:00.000Z"],
    ["2026-08-31T12:00:00.000Z", "2026-02-28T12:00:00.000Z"],
    ["2024-08-31T12:00:00.000Z", "2024-02-29T12:00:00.000Z"],
  ] as const)(
    "clamps %s onto last valid UTC day of target month",
    (source, expected) => {
      expect(newnessCutoffUtc(new Date(source)).toISOString()).toBe(expected);
    }
  );
});

describe("listingChromeFromRow", () => {
  const now = new Date("2026-09-11T00:00:00.000Z");
  const cutoff = newnessCutoffUtc(now);
  const young = new Date("2026-06-01T00:00:00.000Z");
  const old = new Date("2025-01-01T00:00:00.000Z");

  it("ranks repair over sale and newness", () => {
    expect(listingChromeFromRow(VanState.IN_REPAIR, young, cutoff)).toBe(
      VanState.IN_REPAIR
    );
  });

  it("ranks sale over newness", () => {
    expect(listingChromeFromRow(VanState.ON_SALE, young, cutoff)).toBe(
      VanState.ON_SALE
    );
  });

  it("uses newness only when available and young", () => {
    expect(listingChromeFromRow(VanState.AVAILABLE, young, cutoff)).toBe("NEW");
  });

  it("is available when old and not repair or sale", () => {
    expect(listingChromeFromRow(VanState.AVAILABLE, old, cutoff)).toBe(
      VanState.AVAILABLE
    );
  });
});
