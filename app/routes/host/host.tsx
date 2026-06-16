import clsx from 'clsx';
import {
	type ChangeEventHandler,
	type SubmitEventHandler,
	Suspense,
	useId,
	useOptimistic,
	useState,
	useTransition,
	ViewTransition,
} from 'react';
import {
	Await,
	data,
	href,
	isRouteErrorResponse,
	useFetcher,
} from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from '~/constants/constants';
import { RatingStars } from '~/features/host/components/review/rating-stars';
import { balanceReducer } from '~/features/host/hooks/balance-reducer';
import { moneySchema } from '~/features/host/schemas.server';
import { loadHostDashboard } from '~/features/host/services/dashboard.server';
import { depositOrWithdraw } from '~/features/host/services/wallet.server';
import { authContext } from '~/features/middleware/contexts/auth';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { VanCard } from '~/features/vans/components/van-card';
import { VanCardSkeleton } from '~/features/vans/components/van-card-skeleton';
import { DEPOSIT, WITHDRAW } from '~/features/vans/constants/vans-constants';
import { displayPrice } from '~/features/vans/utils/display-price';
import { calculateTotalIncome } from '~/utils/calculate-income';
import { getElapsedTime } from '~/utils/get-elapsed-time';
import { validateArkType } from '~/utils/parse-arktype.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/host';

export const loader = async ({ context }: Route.LoaderArgs) => {
	const user = context.get(authContext);

	const dashboard = await loadHostDashboard(user.id);

	return data(
		{
			...dashboard,
			name: user.name,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
};

export const action = async ({ request, context }: Route.ActionArgs) => {
	const user = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());
	const validation = validateArkType(moneySchema, formData);

	if (!validation.success) {
		return {
			errors: validation.errors.summary,
			formData,
		};
	}

	const { amount, type: transactionType } = validation.data;

	const result2 = await tryCatch(() =>
		depositOrWithdraw(user.id, amount, transactionType)
	);

	if (result2.error) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
};

const Host = ({ loaderData, actionData }: Route.ComponentProps) => {
	const { vansPromise, avgRating, name, transactions, transactionSummary } =
		loaderData;

	const [isDepositing, setIsDepositing] = useState(() => {
		const type = actionData?.formData?.type as string | undefined;
		return type !== WITHDRAW;
	});

	const currentBalance =
		typeof transactionSummary === 'number' ? transactionSummary : 0;

	const fetcher = useFetcher();
	const [isPending, startTransition] = useTransition();
	const id = useId();

	// Use optimistic updates for balance
	const [optimisticBalance, addOptimisticBalance] = useOptimistic(
		currentBalance,
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

	const handleChangeType: ChangeEventHandler<HTMLInputElement> = (e) => {
		startTransition(() => setIsDepositing(e.currentTarget.value === DEPOSIT));
	};

	// Calculate income and elapsed time client-side
	const sumIncome = calculateTotalIncome(transactions);
	const elapsedTime = getElapsedTime(transactions);

	const rating =
		typeof avgRating === 'number' ? (
			<>
				Your Avg Review <RatingStars rating={avgRating} />{' '}
			</>
		) : (
			'something went wrong'
		);

	return (
		<PendingUI as="section">
			{/* SEO */}
			<title>Host Dashboard | Van Life</title>
			<meta
				content="Your Van Life host dashboard - manage your vans, view income, and track rentals"
				name="description"
			/>
			{/* Income Section */}
			<div className="full-layout grid grid-cols-min items-center justify-between gap-x-2 bg-orange-100 py-6 sm:py-9">
				<h2 className="col-start-1 font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
					Welcome, {name ? name : 'User'}!
				</h2>
				<div className="col-start-1 my-4 grid grid-cols-[1fr_min-content] grid-rows-2 items-center justify-between gap-4 font-light text-base text-neutral-600">
					<p className="font-light text-sm sm:font-normal sm:text-base">
						Income last{' '}
						<span className="underline sm:font-medium">
							{elapsedTime.elapsedDays} days
						</span>
					</p>
					<p className="justify-self-end font-semibold text-neutral-900 text-xl xs:text-3xl sm:font-bold sm:text-4xl md:font-extrabold md:text-5xl">
						{displayPrice(sumIncome)}
					</p>

					<p className="text-sm sm:text-base">Balance</p>
					<p
						className={clsx(
							'justify-self-end font-semibold text-neutral-90 text-xl0 xs:text-3xl sm:font-bold sm:text-4xl md:font-extrabold md:text-5xl',
							!!isPending && 'opacity-75'
						)}
					>
						{displayPrice(optimisticBalance)}
					</p>
				</div>
				<CustomLink
					className="col-start-2 row-start-2"
					to={href('/host/income')}
				>
					Details
				</CustomLink>
			</div>

			{/* Reviews Section */}
			<div className="full-layout flex items-center justify-between bg-orange-200 py-6 sm:py-9">
				<div className="font-bold text-lg text-shadow-text sm:text-2xl">
					<span>{rating}</span>
				</div>
				<CustomLink
					className="font-medium text-base text-shadow-text"
					to={href('/host/review')}
				>
					Details
				</CustomLink>
			</div>

			{/* Money Transaction Form */}
			<Card className="mt-11 py-6 sm:py-9 md:w-1/2">
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
								checked={isDepositing}
								name="type"
								onChange={handleChangeType}
								required
								type="radio"
								value={DEPOSIT}
							/>
						</Label>
						<Label>
							Withdraw
							<Input
								checked={!isDepositing}
								name="type"
								onChange={handleChangeType}
								type="radio"
								value={WITHDRAW}
							/>
						</Label>
					</div>
					<Label htmlFor={id}>Amount</Label>
					<Input
						defaultValue={
							(actionData?.formData?.amount as string | undefined) ?? ''
						}
						id={id}
						max={isDepositing ? MAX_ADD : optimisticBalance}
						min={isDepositing ? MIN_ADD : MIN_WITHDRAW}
						name="amount"
						placeholder="2000"
						type="number"
					/>
					<ViewTransition>
						{actionData?.errors ? (
							<p className="text-red-500">{actionData.errors}</p>
						) : null}
					</ViewTransition>
					<Button type="submit">Complete transaction</Button>
				</fetcher.Form>
			</Card>

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
							errorStateMessage="Something went wrong"
							items={vans}
							renderProps={(item) => ({
								van: item,
								link: href('/host/vans/:vanSlug/:action?', {
									vanSlug: item.slug,
									action: 'edit',
								}),
								action: <p className="justify-self-end text-right">Edit</p>,
							})}
						/>
					)}
				</Await>
			</Suspense>
		</PendingUI>
	);
};
export default Host;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
	if (isRouteErrorResponse(error)) {
		return (
			<UnsuccesfulState
				isError
				message={error.statusText || 'An unknown error occurred.'}
			/>
		);
	}
	if (error instanceof Error) {
		return (
			<UnsuccesfulState
				isError
				message="Something went wrong loading your dashboard."
			/>
		);
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
};
