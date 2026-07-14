import type { TransactionModel } from "~/db/client.server";

export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/** Generic list-item id (UI / pagination). Not the branded DB UUIDv7. */
export interface Id {
  id: string;
}

export type Amount = Prettify<Pick<TransactionModel, "amount">>;

export type Replace<T, K extends keyof T, U> = Prettify<
  Omit<T, K> & { [P in K]: U }
>;

export interface Search {
  search?: string;
}

export interface Message {
  message: string;
}
