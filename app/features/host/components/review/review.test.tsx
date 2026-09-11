import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { CHART_HEIGHT_BAND_COLOR_BY_VARIANT } from "~/features/host/utils/chart-height-bands";
import type { UUIDv7 } from "~/types/ids.server";
import { Review } from "./review";

describe("Review rating rail", () => {
  it("keeps fill height from the rating while coloring the chart slice", () => {
    const { container } = render(
      <Review
        date={new Date("2024-01-01T00:00:00.000Z")}
        heightBand="five"
        id={"01900000-0000-7000-8000-000000000020" as UUIDv7}
        name="Alice"
        rating={2}
        text="Smooth trip."
      />
    );

    const rail = container.querySelector(".rating-rail");

    expect(rail).toHaveAttribute("data-rating", "2");
    expect(rail).toHaveAttribute("data-height-band", "five");
    expect(container.firstElementChild).toHaveStyle({
      "--rating": "2",
      "--rating-band-color": CHART_HEIGHT_BAND_COLOR_BY_VARIANT.five,
    });
  });
});
