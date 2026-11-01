import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { TransactionType } from "~/db/enums";
import { RentalTransaction } from "./rental-transaction";

const renderTransaction = (type: TransactionType) =>
  render(
    <RentalTransaction
      amount={7000}
      createdAt={new Date("2024-01-01T00:00:00Z")}
      id="txn-1"
      rentDuration="3 days"
      rentName="Modest Explorer"
      type={type as never}
    />
  );

describe("RentalTransaction", () => {
  it("names the movement from its type and carries no chart band", () => {
    const { container } = renderTransaction(TransactionType.RENTAL_PAYMENT);

    expect(screen.getByText("Received")).toBeInTheDocument();
    expect(
      container.querySelector("article")?.dataset.heightBand
    ).toBeUndefined();
  });

  it("labels a return as the sent side", () => {
    renderTransaction(TransactionType.RENTAL_RETURN);

    expect(screen.getByText("Sent")).toBeInTheDocument();
  });
});
