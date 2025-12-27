import type {
	ReviewModel,
	TransactionModel,
	UserModel,
} from '~/generated/prisma/models';
import type { Maybe } from '~/types/types';

export type DataArray = {
	name: string;
	amount: number;
}[];

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
