import type { TransactionType } from "~/db/enums";
import {
  isRentalTransactionType,
  isWalletTransactionType,
  type RentalTransactionProps,
  type RentalTransactionType,
  type WalletTransactionProps,
  type WalletTransactionType,
} from "~/features/host/components/transaction/transaction-types";
import type { Maybe, Prettify } from "~/types";
import { DomainError } from "~/utils/errors/domain-error.server";
import { rentDurationLabel } from "~/utils/get-elapsed-time.server";

const UNKNOWN_COUNTERPARTY_NAME = "Unknown";

interface TransactionListRow {
  amount: number;
  createdAt: Date;
  id: string;
  type: TransactionType;
}

type RentalListRow = Prettify<
  TransactionListRow & {
    rentedAt: Maybe<Date>;
    rentedTo: Maybe<Date>;
    rentName: Maybe<string>;
  }
>;

function assertRentalType(type: TransactionType): RentalTransactionType {
  if (!isRentalTransactionType(type)) {
    throw new DomainError(
      "INVALID_ID",
      `Expected rental activity type, got ${type}`,
      "transaction"
    );
  }

  return type;
}

function assertWalletType(type: TransactionType): WalletTransactionType {
  if (!isWalletTransactionType(type)) {
    throw new DomainError(
      "INVALID_ID",
      `Expected wallet movement type, got ${type}`,
      "transaction"
    );
  }

  return type;
}

export function toRentalTransactionListItem(
  row: RentalListRow
): RentalTransactionProps {
  return {
    amount: row.amount,
    createdAt: row.createdAt,
    id: row.id,
    rentDuration: rentDurationLabel(row.rentedAt, row.rentedTo),
    rentName: row.rentName?.trim() || UNKNOWN_COUNTERPARTY_NAME,
    type: assertRentalType(row.type),
  };
}

export function toWalletTransactionListItem(
  row: TransactionListRow
): WalletTransactionProps {
  return {
    amount: row.amount,
    createdAt: row.createdAt,
    id: row.id,
    type: assertWalletType(row.type),
  };
}
