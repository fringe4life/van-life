import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { TransactionType } from "~/db/enums";
import { RentalTransaction } from "./rental-transaction";

describe("RentalTransaction", () => {
  it("colors the rail from the chart slice the amount belongs in", () => {
    render(
      <RentalTransaction
        amount={7000}
        chartMagnitudeMax={10_000}
        createdAt={new Date("2024-01-01T00:00:00Z")}
        id="txn-1"
        rentDuration="3 days"
        rentName="Modest Explorer"
        type={TransactionType.RENTAL_PAYMENT}
      />
    );

    expect(screen.getByRole("article")).toHaveAttribute(
      "data-height-band",
      "four"
    );
  });
});
