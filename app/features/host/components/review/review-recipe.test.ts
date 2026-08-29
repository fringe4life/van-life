import { describe, expect, it } from "bun:test";
import { formatReviewRating, normalizeReviewRating } from "./review-recipe";

describe("normalizeReviewRating", () => {
  it("rounds fractional ratings to the nearest supported score", () => {
    expect(normalizeReviewRating(3.4)).toBe(3);
    expect(normalizeReviewRating(3.5)).toBe(4);
  });

  it("clamps ratings to the supported score range", () => {
    expect(normalizeReviewRating(0)).toBe(1);
    expect(normalizeReviewRating(6)).toBe(5);
  });
});

describe("formatReviewRating", () => {
  it("formats normalized ratings as integers", () => {
    expect(formatReviewRating(4)).toBe("4");
    expect(formatReviewRating(3.5)).toBe("4");
  });
});
