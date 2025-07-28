import { type ChangeEventHandler, useState } from 'react';
import { data, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/common/CustomForm';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { getAccountSummary } from '~/db/user/analytics';
import { addMoney } from '~/db/user/payments';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { moneySchema } from '~/lib/schemas.server';
import { tryCatch } from '~/lib/tryCatch.server';
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
	const { session, headers } = await getSessionOrRedirect(request);
	const maxWithrawalAmount = await getAccountSummary(session.user.id);

	return data(
		{ maxWithrawalAmount },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...headers,
			},
		},
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
		addMoney(session.user.id, result.data.amount),
	);

	if (result2.error) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
	throw redirect(href('/host'));
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
			<CustomForm method="POST" className="mt-6 grid max-w-102 gap-4">
				<div className="flex gap-4">
					<Label>
						Deposit
						<Input
							type="radio"
							name="type"
							required
							value="deposit"
							defaultChecked={
								(actionData?.formData?.type as string) === 'deposit' || true
							}
						/>
					</Label>
					<Label>
						Withdraw
						<Input
							onChange={handleChange}
							type="radio"
							name="type"
							value="withdraw"
							defaultChecked={
								(actionData?.formData?.type as string) === 'withdraw'
							}
						/>
					</Label>
				</div>

				<Input
					type="number"
					name="amount"
					placeholder="2000"
					defaultValue={(actionData?.formData?.money as string) ?? ''}
					list="vanTypeList"
					min={MIN_ADD}
					max={isDepositing ? loaderData?.maxWithrawalAmount : MAX_ADD}
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Complete transaction</Button>
			</CustomForm>
		</section>
	);
}
