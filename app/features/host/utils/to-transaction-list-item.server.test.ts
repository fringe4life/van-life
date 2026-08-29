import { describe, expect, it } from "bun:test";
import { TransactionType } from "~/db/enums";
import { DomainError } from "~/utils/errors/domain-error.server";
import {
  toRentalTransactionListItem,
  toWalletTransactionListItem,
} from "./to-transaction-list-item.server";

describe("toRentalTransactionListItem", () => {
  const base = {
    amount: 120,
    createdAt: new Date("2024-05-04T00:00:00Z"),
    id: "txn-1",
  };

  it("maps rental rows with counterparty name and duration label", () => {
    expect(
      toRentalTransactionListItem({
        ...base,
        rentedAt: new Date("2024-05-01T00:00:00Z"),
        rentedTo: new Date("2024-05-03T00:00:00Z"),
        rentName: "Ada",
        type: TransactionType.RENTAL_PAYMENT,
      })
    ).toEqual({
      ...base,
      rentDuration: "3 days",
      rentName: "Ada",
      type: TransactionType.RENTAL_PAYMENT,
    });
  });

  it("falls back when rental join is missing", () => {
    expect(
      toRentalTransactionListItem({
        ...base,
        rentedAt: null,
        rentedTo: null,
        rentName: null,
        type: TransactionType.RENTAL_RETURN,
      })
    ).toEqual({
      ...base,
      rentDuration: "0 days",
      rentName: "Unknown",
      type: TransactionType.RENTAL_RETURN,
    });
  });

  it("throws DomainError when type is not rental activity", () => {
    expect(() =>
      toRentalTransactionListItem({
        ...base,
        rentedAt: null,
        rentedTo: null,
        rentName: null,
        type: TransactionType.DEPOSIT,
      })
    ).toThrow(DomainError);
  });
});

describe("toWalletTransactionListItem", () => {
  it("maps wallet rows without rental fields", () => {
    expect(
      toWalletTransactionListItem({
        amount: 120,
        createdAt: new Date("2024-05-04T00:00:00Z"),
        id: "txn-1",
        type: TransactionType.DEPOSIT,
      })
    ).toEqual({
      amount: 120,
      createdAt: new Date("2024-05-04T00:00:00Z"),
      id: "txn-1",
      type: TransactionType.DEPOSIT,
    });
  });

  it("throws DomainError when type is not wallet movement", () => {
    expect(() =>
      toWalletTransactionListItem({
        amount: 120,
        createdAt: new Date("2024-05-04T00:00:00Z"),
        id: "txn-1",
        type: TransactionType.RENTAL_PAYMENT,
      })
    ).toThrow(DomainError);
  });
});
