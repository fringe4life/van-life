import { type ChangeEventHandler, useState } from 'react';
import { data, Form, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { addMoney } from '~/db/addMoney';
import { getAccountSummary } from '~/db/getAccountSummary';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { moneySchema } from '~/lib/schemas.server';
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
	const session = await getSessionOrRedirect(request);
	const maxWithrawalAmount = await getAccountSummary(session.user.id);

	return data(
		{ maxWithrawalAmount },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export async function action({ request }: Route.ActionArgs) {
	const session = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());
	const result = moneySchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			formData,
		};
	}

	const success = await addMoney(session.user.id, result.data.amount);

	if (!success) {
		return {
			errors: "Something wen't wrong please try again later",
			formData,
		};
	}
	throw redirect(href('/host'));
}

export default function MoneyTransaction({
	actionData,
	loaderData,
}: Route.ComponentProps) {
	const { usingForm } = useIsNavigating();
	const [isDepositing, setIsDepositing] = useState(() => false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setIsDepositing(e.currentTarget.checked);
	};
	return (
		<section>
			<h2 className="font-bold text-4xl text-neutral-900">
				Add or withdraw money
			</h2>
			<Form method="POST" className="mt-6 grid max-w-102 gap-4">
				<fieldset className="flex gap-4">
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
				</fieldset>
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
				<Button type="submit" disabled={usingForm}>
					Complete transaction
				</Button>
			</Form>
		</section>
	);
}
