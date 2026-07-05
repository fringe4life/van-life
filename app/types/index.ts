import type { TransactionModel, VanModel } from '~/generated/prisma/models';

export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type Id = Prettify<Pick<VanModel, 'id'>>;

export type Amount = Prettify<Pick<TransactionModel, 'amount'>>;

export type Replace<T, K extends keyof T, U> = Prettify<
	Omit<T, K> & { [P in K]: U }
>;

export interface Search {
	search?: string;
}
