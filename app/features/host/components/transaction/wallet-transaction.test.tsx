import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { TransactionType } from "~/db/enums";
import { WalletTransaction } from "./wallet-transaction";

const renderTransaction = (type: TransactionType) =>
  render(
    <WalletTransaction
      amount={7000}
      createdAt={new Date("2024-01-01T00:00:00Z")}
      id="txn-1"
      type={type as never}
    />
  );

describe("WalletTransaction", () => {
  it("reads a withdrawal from the balance", () => {
    renderTransaction(TransactionType.WITHDRAW);

    expect(screen.getByText("Withdrawal")).toBeInTheDocument();
    expect(screen.getByText("From your balance")).toBeInTheDocument();
  });

  it("reads a deposit onto the balance", () => {
    renderTransaction(TransactionType.DEPOSIT);

    expect(screen.getByText("Deposit")).toBeInTheDocument();
    expect(screen.getByText("To your balance")).toBeInTheDocument();
  });
});
