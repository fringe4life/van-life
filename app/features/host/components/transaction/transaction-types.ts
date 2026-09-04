import type { TransactionModel } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import type { Id, Prettify } from "~/types";

export const WALLET_MOVEMENT_TYPES = [
  TransactionType.DEPOSIT,
  TransactionType.WITHDRAW,
] as const;

export const RENTAL_ACTIVITY_TYPES = [
  TransactionType.RENTAL_PAYMENT,
  TransactionType.RENTAL_RETURN,
] as const;

export type WalletTransactionType = (typeof WALLET_MOVEMENT_TYPES)[number];
export type RentalTransactionType = (typeof RENTAL_ACTIVITY_TYPES)[number];

type TransactionBase = Pick<TransactionModel, "amount" | "createdAt"> & Id;

/** Shell card: amount, date, id, badge type. No rental/wallet extras. */
type TransactionProps = Prettify<TransactionBase & { type: TransactionType }>;

type WalletTransactionProps = Prettify<
  TransactionBase & { type: WalletTransactionType }
>;

type RentalTransactionProps = Prettify<
  TransactionBase & {
    rentDuration: string;
    rentName: string;
    type: RentalTransactionType;
  }
>;

export type {
  RentalTransactionProps,
  TransactionProps,
  WalletTransactionProps,
};
