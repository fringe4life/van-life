import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { RatingStars } from "./rating-stars";

describe("RatingStars", () => {
  it("clips each star from the rating and that star's index", () => {
    const { container } = render(<RatingStars rating={3.4} />);
    const fills = [...container.querySelectorAll(".rating-star-fill")];

    expect(fills).toHaveLength(5);
    expect(fills.map((fill) => fill.getAttribute("style"))).toEqual([
      "--rating: 3.4; --star-index: 1;",
      "--rating: 3.4; --star-index: 2;",
      "--rating: 3.4; --star-index: 3;",
      "--rating: 3.4; --star-index: 4;",
      "--rating: 3.4; --star-index: 5;",
    ]);
  });
});
