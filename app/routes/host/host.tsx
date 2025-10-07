import { type } from 'arktype';
import clsx from 'clsx';
import {
	type ChangeEventHandler,
	type FormEventHandler,
	Suspense,
	useOptimistic,
	useState,
	useTransition,
} from 'react';
import { Await, data, href, useFetcher, useParams } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { getAverageReviewRating } from '~/db/review/analytics';
import {
	getHostTransactions,
	getTransactionSummary,
} from '~/db/user/analytics';
import { addMoney } from '~/db/user/payments';
import { getHostVans } from '~/db/van/host';
import RatingStars from '~/features/host/components/review/rating-stars';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import VanCard from '~/features/vans/components/van-card';
import VanCardSkeleton from '~/features/vans/components/van-card-skeleton';
import { DEPOSIT, WITHDRAW } from '~/features/vans/constants/vans-constants';
import { displayPrice } from '~/features/vans/utils/display-price';
import { moneySchema } from '~/lib/schemas.server';
import { calculateTotalIncome, getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
import { validateTransactionType } from '~/utils/validators';
import type { Route } from './+types/host';

export function meta() {
	return [
		{ title: 'Host | Vanlife' },
		{
			name: 'description',
			content: 'the dashboard page when you are logged in',
		},
	];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Create a promise for vans data (will be resolved on client)
	const hostVansLimit = 2;
	const vansPromise = Promise.resolve(
		getHostVans(session.user.id, undefined, hostVansLimit)
	);

	const [transactionsResult, avgRatingResult, transactionSummaryResult] =
		await Promise.all([
			tryCatch(async () => await getHostTransactions(session.user.id)),
			tryCatch(async () => await getAverageReviewRating(session.user.id)),
			tryCatch(async () => await getTransactionSummary(session.user.id)),
		]);

	const transactions = transactionsResult.data ?? [];
	const avgRating = avgRatingResult.data ?? 0;

	return data(
		{
			vansPromise,
			avgRating,
			name: session.user.name,
			transactions,
			transactionSummary: transactionSummaryResult.data,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export async function action({ request, context }: Route.ActionArgs) {
	const session = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());
	const result = moneySchema(formData);

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			formData,
		};
	}

	// Additional validation for money operations
	let isValid = false;
	if (result.type === WITHDRAW) {
		// For withdrawals, amount should be negative (or we'll make it negative)
		isValid =
			Math.abs(result.amount) >= MIN_ADD && Math.abs(result.amount) <= MAX_ADD;
	} else {
		// For deposits, amount should be positive
		isValid = result.amount >= MIN_ADD && result.amount <= MAX_ADD;
	}

	if (!isValid) {
		return {
			errors: 'Amount must be within valid range for transaction type',
			formData,
		};
	}

	// Adjust amount based on transaction type
	const adjustedAmount =
		result.type === WITHDRAW
			? -Math.abs(result.amount) // Withdrawals are negative
			: Math.abs(result.amount); // Deposits are positive

	const result2 = await tryCatch(() =>
		addMoney(
			session.user.id,
			adjustedAmount,
			validateTransactionType(result.type)
		)
	);

	if (result2.error) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
}

export default function Host({ loaderData, actionData }: Route.ComponentProps) {
	const { vansPromise, avgRating, name, transactions, transactionSummary } =
		loaderData;

	const [isDepositing, setIsDepositing] = useState(() => false);
	const currentBalance =
		typeof transactionSummary === 'number' ? transactionSummary : 0;

	const fetcher = useFetcher();
	const [isPending, startTransition] = useTransition();

	// Use optimistic updates for balance
	const [optimisticBalance, addOptimisticBalance] = useOptimistic(
		currentBalance,
		(state: number, newTransaction: { amount: number; type: string }) => {
			const adjustedAmount =
				newTransaction.type === WITHDRAW
					? -Math.abs(newTransaction.amount)
					: Math.abs(newTransaction.amount);
			return state + adjustedAmount;
		}
	);
	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const amount = Number(formData.get('amount'));
		const transactionType = formData.get('type') as string;

		startTransition(() => {
			addOptimisticBalance({ amount, type: transactionType });

			fetcher.submit(formData, {
				method: 'POST',
				action: href('/host'),
			});
		});
	};

	// Calculate current balance from transactions

	// Calculate income and elapsed time client-side
	const sumIncome = Array.isArray(transactions)
		? calculateTotalIncome(transactions)
		: 0;
	const elapsedTime = Array.isArray(transactions)
		? getElapsedTime(transactions)
		: { elapsedDays: 0, description: 'No data' };

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setIsDepositing(e.currentTarget.checked);
	};

	return (
		<PendingUi as="section">
			{/* Income Section */}
			<div className="-mx-[var(--padding-inline)] grid w-[var(--container-layout)] grid-cols-[1fr_fit-content] items-center justify-between bg-orange-100 px-[var(--padding-inline)] py-6 sm:py-9">
				<h2 className="col-start-1 font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
					Welcome {name ? name : 'User'}!
				</h2>
				<p className="col-start-1 my-4 font-light text-base text-neutral-600 sm:my-6 md:my-8">
					Income last{' '}
					<span className="font-medium underline">
						{elapsedTime.elapsedDays} days
					</span>
				</p>
				<p className="col-start-1 font-extrabold text-2xl text-neutral-900 xs:text-3xl sm:text-4xl md:text-5xl">
					{displayPrice(sumIncome)}
				</p>
				<CustomLink
					className="col-start-2 row-start-2"
					to={href('/host/income')}
				>
					Details
				</CustomLink>
			</div>

			{/* Balance Section */}
			<div className="-mx-[var(--padding-inline)] grid w-[var(--container-layout)] grid-cols-[1fr_fit-content] items-center justify-between bg-green-100 px-[var(--padding-inline)] py-6 sm:py-9">
				<div>
					<h3 className="font-bold text-lg text-neutral-900 sm:text-xl">
						Current Balance
					</h3>
					<p
						className={clsx(
							'font-extrabold text-2xl text-neutral-900 xs:text-3xl sm:text-4xl md:text-5xl',
							isPending && 'opacity-75'
						)}
					>
						{displayPrice(optimisticBalance)}
					</p>
				</div>
			</div>

			{/* Money Transaction Form */}
			<div className="px-[var(--padding-inline)] py-6 sm:py-9">
				<h3 className="mb-4 font-bold text-lg text-neutral-900 sm:text-xl">
					Add or Withdraw Money
				</h3>
				<fetcher.Form
					className="grid max-w-102 gap-4"
					method="POST"
					onSubmit={handleSubmit}
				>
					<div className="flex gap-4">
						<Label>
							Deposit
							<Input
								defaultChecked={true}
								name="type"
								required
								type="radio"
								value={DEPOSIT}
							/>
						</Label>
						<Label>
							Withdraw
							<Input
								defaultChecked={
									(actionData?.formData?.type as string) === 'withdraw'
								}
								name="type"
								onChange={handleChange}
								type="radio"
								value={WITHDRAW}
							/>
						</Label>
					</div>

					<Input
						defaultValue={(actionData?.formData?.amount as string) ?? ''}
						max={isDepositing ? optimisticBalance : MAX_ADD}
						min={MIN_ADD}
						name="amount"
						placeholder="2000"
						type="number"
					/>
					{actionData?.errors ? (
						<p className="text-red-500">{actionData.errors}</p>
					) : null}
					<Button type="submit">Complete transaction</Button>
				</fetcher.Form>
			</div>

			{/* Reviews Section */}
			<div className="-mx-[var(--padding-inline)] flex w-[var(--container-layout)] items-center justify-between bg-orange-200 px-[var(--padding-inline)] py-6 sm:py-9">
				<div className="font-bold text-lg text-shadow-text sm:text-2xl">
					{typeof avgRating === 'number' ? (
						<span>
							Your Avg Review <RatingStars rating={avgRating} />
						</span>
					) : (
						<span>something went wrong</span>
					)}
				</div>
				<CustomLink
					className="font-medium text-base text-shadow-text"
					to={href('/host/review')}
				>
					Details
				</CustomLink>
			</div>

			{/* Vans Section */}
			<Suspense
				fallback={
					<div className="grid-max mt-11">
						<VanCardSkeleton />
						<VanCardSkeleton />
						<VanCardSkeleton />
					</div>
				}
			>
				<Await
					errorElement={<UnsuccesfulState message="Something went wrong" />}
					resolve={vansPromise}
				>
					{(vans) => (
						<GenericComponent
							Component={VanCard}
							className="grid-max mt-11"
							emptyStateMessage="You are not currently renting any vans"
							items={Array.isArray(vans) ? vans : []}
							renderKey={(item) => item.id}
							renderProps={(item) => ({
								van: item,
								link: href('/host/vans/:vanId', { vanId: item.id }),
								action: <p className="justify-self-end text-right">Edit</p>,
							})}
						/>
					)}
				</Await>
			</Suspense>
		</PendingUi>
	);
}

export function ErrorBoundary() {
	const message = 'Oops!';
	const details = 'An unexpected error occurred. Please try again later';

	const params = useParams();
	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{Object.entries(params).length >= 1 && (
				<p>
					Your Van could not be found. Add it here{' '}
					<CustomLink to={href('/host/add')}>Add a new Van</CustomLink>
				</p>
			)}
		</main>
	);
}
