import type { Amount, Maybe, Prettify } from "~/types";

export type DataArray = Prettify<{ name: string } & Amount>[];

export interface Data<T> {
  data: T;
}

export interface Params {
  action?: Maybe<string>;
  vanSlug: string;
}

export const MONEY_FORM_FIELDS = ["amount"] as const;

/** Safe subset replayed to the client (amount + deposit/withdraw type). */
export const MONEY_ECHO_FIELDS = ["amount", "type"] as const;
