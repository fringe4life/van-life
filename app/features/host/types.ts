import type {
	ReviewModel,
	TransactionModel,
	UserModel,
} from '~/generated/prisma/models';
import type { Amount, Maybe } from '~/types/types';

export type DataArray = Array<
	{
		name: string;
	} & Amount
>;

export interface Data<T> {
	data: T;
}

export interface ReviewProps
	extends Pick<UserModel, 'name'>,
		Omit<
			ReviewModel,
			'user' | 'rent' | 'createdAt' | 'updatedAt' | 'rentId' | 'userId'
		> {
	timestamp: Maybe<string>;
}

export interface IncomeProps
	extends Pick<TransactionModel, 'amount' | 'createdAt' | 'id'> {}

export interface RatingStarsProps extends Pick<ReviewModel, 'rating'> {}

export interface Params {
	vanSlug: string;
	action?: Maybe<string>;
}
