import { WITHDRAW } from '~/features/vans/constants/vans-constants';

const balanceReducer = (
	state: number,
	newTransaction: { amount: number; type: string }
) => {
	const adjustedAmount =
		newTransaction.type === WITHDRAW
			? -Math.abs(newTransaction.amount)
			: Math.abs(newTransaction.amount);
	return state + adjustedAmount;
};

export { balanceReducer };
