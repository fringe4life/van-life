import { describe, expect, it } from "bun:test";
import { rents } from "./rents";
import { reviews } from "./reviews";
import { expandSeed, SEED_VOLUME, staggerDates } from "./scale";
import { transactions } from "./transactions";

describe("seed volume", () => {
  it("scales templates past 100 per collection", () => {
    expect(SEED_VOLUME.rents).toBeGreaterThan(100);
    expect(rents).toHaveLength(SEED_VOLUME.rents);
    expect(reviews).toHaveLength(SEED_VOLUME.reviews);
    expect(transactions).toHaveLength(SEED_VOLUME.transactions);
  });

  it("staggers only dates that exist on the item", () => {
    const [first, last] = staggerDates(
      expandSeed([{ rentedAt: new Date("2020-01-01T00:00:00Z") }], 2)
    );

    expect(first).not.toHaveProperty("createdAt");
    expect(last.rentedAt.getTime()).toBeGreaterThan(first.rentedAt.getTime());
  });
});
