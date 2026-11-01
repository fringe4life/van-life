import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import type { UUIDv7 } from "~/types/ids.server";
import { Review } from "./review";

describe("Review rating rail", () => {
  it("fills the rail from the rating alone", () => {
    const { container } = render(
      <Review
        date={new Date("2024-01-01T00:00:00.000Z")}
        id={"01900000-0000-7000-8000-000000000020" as UUIDv7}
        name="Alice"
        rating={2}
        text="Smooth trip."
      />
    );

    const rail = container.querySelector(".rating-rail");

    expect(rail).toHaveAttribute("data-rating", "2");
    expect(rail).not.toHaveAttribute("data-height-band");
    expect(container.firstElementChild).toHaveStyle({ "--rating": "2" });
  });
});
