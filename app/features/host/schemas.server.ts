import { type } from 'arktype';
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from '~/constants/constants';
import { DEPOSIT, WITHDRAW } from '~/features/vans/constants/vans-constants';

const moneyTransactionType = type.or(`"${DEPOSIT}"`, `"${WITHDRAW}"`);

/**
 * Money form: deposit/withdraw type + positive amount.
 * Pipe normalizes sign (deposits +, withdrawals -) for storage.
 */
export const moneySchema = type({
	type: moneyTransactionType,
	amount: 'string.numeric.parse',
})
	.narrow((data, ctx) => {
		if (data.amount <= 0) {
			return ctx.reject({
				expected: 'greater than 0',
				actual: String(data.amount),
				path: ['amount'],
			});
		}

		if (data.amount > MAX_ADD) {
			return ctx.reject({
				expected: `at most ${MAX_ADD}`,
				actual: String(data.amount),
				path: ['amount'],
			});
		}

		const minAmount = data.type === DEPOSIT ? MIN_ADD : MIN_WITHDRAW;

		if (data.amount < minAmount) {
			return ctx.reject({
				expected: `at least ${minAmount}`,
				actual: String(data.amount),
				path: ['amount'],
			});
		}

		return true;
	})
	.pipe((data) => ({
		type: data.type,
		amount: data.type === WITHDRAW ? -data.amount : data.amount,
	}));
