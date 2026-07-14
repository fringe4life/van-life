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

type MoneyFormFieldKey = (typeof MONEY_FORM_FIELDS)[number];

export type MoneyFormFieldErrors = {
  [K in MoneyFormFieldKey]?: string;
};
