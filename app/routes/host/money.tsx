import { type ChangeEventHandler, useState } from 'react';
import { data, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { getAccountSummary } from '~/db/user/analytics';
import { addMoney } from '~/db/user/payments';
import { getSessionOrRedirect } from '~/lib/get-session-or-redirect.server';
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

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers: cookies } = await getSessionOrRedirect(request);
	const maxWithrawalAmount = await getAccountSummary(session.user.id);

	return data(
		{ maxWithrawalAmount },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...cookies,
			},
		}
	);
}

export async function action({ request }: Route.ActionArgs) {
	const { session } = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());
	const result = moneySchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			formData,
		};
	}

	const result2 = await tryCatch(() =>
		addMoney(
			session.user.id,
			result.data.amount,
			validateTransactionType(result.data.type)
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
							value="DEPOSIT"
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
							value="WITHDRAW"
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
