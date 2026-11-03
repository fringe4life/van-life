import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { TransactionType } from "~/db/enums";
import { TransactionBadge } from "./transaction-badge";

const WALLET_TYPES = [
  TransactionType.DEPOSIT,
  TransactionType.WITHDRAW,
] as const;
const RENTAL_TYPES = [
  TransactionType.RENTAL_PAYMENT,
  TransactionType.RENTAL_RETURN,
] as const;

describe("TransactionBadge", () => {
  it("names the ledger each movement belongs to", () => {
    for (const type of Object.values(TransactionType)) {
      render(<TransactionBadge type={type} />);
    }

    expect(screen.getAllByText("Wallet")).toHaveLength(2);
    expect(screen.getAllByText("Rental")).toHaveLength(2);
  });

  it("draws wallet movement as an arrow on a line", () => {
    for (const type of WALLET_TYPES) {
      const { container } = render(<TransactionBadge type={type} />);

      expect(container.querySelectorAll("svg path")).toHaveLength(3);
      // The baseline is the one path outside the tinted group.
      expect(container.querySelectorAll("svg > path")).toHaveLength(1);
      expect(container.querySelector("rect")).toBeNull();
    }
  });

  it("draws rental movement as one direction arrow", () => {
    const heads: string[] = [];

    for (const type of RENTAL_TYPES) {
      const { container } = render(<TransactionBadge type={type} />);

      expect(container.querySelector("rect")).toBeNull();
      expect(container.querySelectorAll("svg path")).toHaveLength(2);
      expect(container.querySelectorAll("svg > g path")).toHaveLength(2);
      heads.push(
        container.querySelectorAll("svg path")[1]?.getAttribute("d") ?? ""
      );
    }

    expect(heads).toHaveLength(2);
    expect(heads[0]).not.toBe(heads[1]);
  });
});
