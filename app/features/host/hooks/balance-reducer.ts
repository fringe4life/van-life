import { WITHDRAW } from '~/features/vans/constants/vans-constants';

const balanceReducer = (
	state: number,
	newTransaction: { amount: number; type: string }
) => {
	const adjustedAmount =
		newTransaction.type === WITHDRAW
			? -newTransaction.amount
			: newTransaction.amount;
	return state + adjustedAmount;
};

export { balanceReducer };
