import { MAX_RATING } from "~/features/host/constants/constants";

export interface RatingCount {
  count: number;
  rating: number;
}

export interface RatingBucket extends RatingCount {
  percentage: number;
}

export interface RatingMixData {
  average: number;
  buckets: RatingBucket[];
  total: number;
}

const sumCounts = (buckets: readonly RatingCount[]): number =>
  buckets.reduce((sum, bucket) => sum + bucket.count, 0);

const toPercentage = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * 100) : 0;

/** Star histogram keyed by rating, highest first. Ratings with no reviews stay as zero rows. */
function toRatingBuckets(counts: readonly RatingCount[]): RatingBucket[] {
  const countByRating = new Map(
    counts.map(({ count, rating }) => [rating, count])
  );
  const total = sumCounts(counts);

  return Array.from(
    { length: MAX_RATING },
    (_, index) => MAX_RATING - index
  ).map((rating) => {
    const count = countByRating.get(rating) ?? 0;

    return { count, percentage: toPercentage(count, total), rating };
  });
}

function toAverageRating(buckets: readonly RatingBucket[]): number {
  const total = sumCounts(buckets);

  if (total === 0) {
    return 0;
  }

  const weightedTotal = buckets.reduce(
    (sum, { count, rating }) => sum + rating * count,
    0
  );

  return Math.round((weightedTotal / total) * 10) / 10;
}

export function toRatingMix(counts: readonly RatingCount[]): RatingMixData {
  const buckets = toRatingBuckets(counts);

  return {
    average: toAverageRating(buckets),
    buckets,
    total: sumCounts(buckets),
  };
}
