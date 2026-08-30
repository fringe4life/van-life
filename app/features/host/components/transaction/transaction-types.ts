import type { TransactionModel } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import type { Id, Prettify } from "~/types";

type TransactionBase = Pick<TransactionModel, "amount" | "createdAt"> & Id;

const WALLET_MOVEMENT_TYPES = [
  TransactionType.DEPOSIT,
  TransactionType.WITHDRAW,
] as const;

const RENTAL_ACTIVITY_TYPES = [
  TransactionType.RENTAL_PAYMENT,
  TransactionType.RENTAL_RETURN,
] as const;

type WalletTransactionType = (typeof WALLET_MOVEMENT_TYPES)[number];
type RentalTransactionType = (typeof RENTAL_ACTIVITY_TYPES)[number];

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

function isWalletTransactionType(
  type: TransactionType
): type is WalletTransactionType {
  return WALLET_MOVEMENT_TYPES.some((walletType) => walletType === type);
}

function isRentalTransactionType(
  type: TransactionType
): type is RentalTransactionType {
  return RENTAL_ACTIVITY_TYPES.some((rentalType) => rentalType === type);
}

export type {
  RentalTransactionProps,
  RentalTransactionType,
  TransactionProps,
  WalletTransactionProps,
  WalletTransactionType,
};

export {
  isRentalTransactionType,
  isWalletTransactionType,
  RENTAL_ACTIVITY_TYPES,
  WALLET_MOVEMENT_TYPES,
};
