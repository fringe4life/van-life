export const VanType = {
  LUXURY: "LUXURY",
  RUGGED: "RUGGED",
  SIMPLE: "SIMPLE",
} as const;

export type VanType = (typeof VanType)[keyof typeof VanType];

export const VanState = {
  AVAILABLE: "AVAILABLE",
  IN_REPAIR: "IN_REPAIR",
  ON_SALE: "ON_SALE",
} as const;

export type VanState = (typeof VanState)[keyof typeof VanState];

export const TransactionType = {
  DEPOSIT: "DEPOSIT",
  RENTAL_PAYMENT: "RENTAL_PAYMENT",
  RENTAL_RETURN: "RENTAL_RETURN",
  WITHDRAW: "WITHDRAW",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
