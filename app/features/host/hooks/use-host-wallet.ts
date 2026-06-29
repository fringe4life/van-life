import {
	type ChangeEventHandler,
	type SubmitEventHandler,
	useId,
	useOptimistic,
	useState,
	useTransition,
} from 'react';
import { href, useFetcher } from 'react-router';
import { balanceReducer } from '~/features/host/hooks/balance-reducer';
import { DEPOSIT, WITHDRAW } from '~/features/vans/constants/vans-constants';

const useHostWallet = (
	transactionSummary: number,
	initialTransactionType?: string
) => {
	const [isDepositing, setIsDepositing] = useState(
		() => initialTransactionType !== WITHDRAW
	);

	const fetcher = useFetcher();
	const [isPending, startTransition] = useTransition();
	const amountInputId = useId();

	const [optimisticBalance, addOptimisticBalance] = useOptimistic(
		transactionSummary,
		balanceReducer
	);

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const amount = Number(formData.get('amount'));
		const transactionType = formData.get('type') as string;

		startTransition(() => {
			addOptimisticBalance({ amount, type: transactionType });
			startTransition(async () => {
				await fetcher.submit(formData, {
					method: 'POST',
					action: href('/host'),
				});
			});
		});
	};

	const handleChangeType: ChangeEventHandler<HTMLInputElement> = (event) => {
		startTransition(() =>
			setIsDepositing(event.currentTarget.value === DEPOSIT)
		);
	};

	return {
		amountInputId,
		fetcher,
		handleChangeType,
		handleSubmit,
		isDepositing,
		isPending,
		optimisticBalance,
	};
};

export { useHostWallet };
