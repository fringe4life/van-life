import type { TransactionModel, VanModel } from '~/generated/prisma/models';

export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

export interface Id extends Pick<VanModel, 'id'> {}

export interface Amount extends Pick<TransactionModel, 'amount'> {}

export type Replace<T, K extends keyof T, U> = Omit<T, K> & { [P in K]: U };

export interface Search {
	search?: string;
}
