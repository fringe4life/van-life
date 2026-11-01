import { describe, expect, it } from "bun:test";
import { toRatingMix } from "./rating-mix";

const counts = [
  { count: 5, rating: 5 },
  { count: 2, rating: 4 },
  { count: 1, rating: 1 },
] as const;

describe("toRatingMix", () => {
  it("keeps every rating, highest first, with empty ratings as zero rows", () => {
    const { buckets, total } = toRatingMix(counts);

    expect(total).toBe(8);
    expect(buckets.map(({ count, rating }) => [rating, count])).toEqual([
      [5, 5],
      [4, 2],
      [3, 0],
      [2, 0],
      [1, 1],
    ]);
  });

  it("averages from the histogram, rounded to one decimal", () => {
    expect(toRatingMix(counts).average).toBe(4.3);
  });

  it("shares each rating of the total", () => {
    expect(
      toRatingMix(counts).buckets.map(({ percentage }) => percentage)
    ).toEqual([63, 25, 0, 0, 13]);
  });

  it("returns zeros rather than NaN for a host without reviews", () => {
    const { average, buckets, total } = toRatingMix([]);

    expect(total).toBe(0);
    expect(average).toBe(0);
    expect(buckets.every((bucket) => bucket.percentage === 0)).toBe(true);
  });
});
