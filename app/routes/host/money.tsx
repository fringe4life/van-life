import { type } from 'arktype';
import { type ChangeEventHandler, useState } from 'react';
import { data, href, redirect } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { getAccountSummary } from '~/db/user/analytics';
import { addMoney } from '~/db/user/payments';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { DEPOSIT, WITHDRAW } from '~/features/vans/constants/vans-constants';
import { moneySchema } from '~/lib/schemas.server';
import { tryCatch } from '~/utils/try-catch.server';
import { validateTransactionType } from '~/utils/validators';
import type { Route } from './+types/money';
export function meta() {
	return [
		{ title: 'Transactions | Vanlife' },
		{
			name: 'description',
			description: 'the page where you can add or deposit money',
		},
	];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ context }: Route.LoaderArgs) {
	const session = context.get(authContext);
	const maxWithrawalAmount = await getAccountSummary(session.user.id);

	return data(
		{ maxWithrawalAmount },
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

	// Get returnTo parameter from URL
	const url = new URL(request.url);
	const returnTo = url.searchParams.get('returnTo');

	// Redirect to returnTo URL if provided, otherwise default to /host
	const redirectUrl = returnTo?.startsWith('/') ? returnTo : href('/host');
	throw redirect(redirectUrl);
}

export default function MoneyTransaction({
	actionData,
	loaderData,
}: Route.ComponentProps) {
	const [isDepositing, setIsDepositing] = useState(() => false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setIsDepositing(e.currentTarget.checked);
	};
	return (
		<section>
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
				Add or withdraw money
			</h2>
			<CustomForm className="mt-6 grid max-w-102 gap-4" method="POST">
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
					defaultValue={(actionData?.formData?.money as string) ?? ''}
					list="vanTypeList"
					max={isDepositing ? loaderData?.maxWithrawalAmount : MAX_ADD}
					min={MIN_ADD}
					name="amount"
					placeholder="2000"
					type="number"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Complete transaction</Button>
			</CustomForm>
		</section>
	);
}
