import { data, redirect } from 'react-router';
import { PendingUI } from '~/components/pending-ui';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { HostIncomeSection } from '~/features/host/components/dashboard/host-income-section';
import { HostReviewSection } from '~/features/host/components/dashboard/host-review-section';
import { HostVansSection } from '~/features/host/components/dashboard/host-vans-section';
import { HostWalletForm } from '~/features/host/components/dashboard/host-wallet-form';
import { useHostWallet } from '~/features/host/hooks/use-host-wallet';
import { moneySchema } from '~/features/host/schemas.server';
import { loadHostDashboard } from '~/features/host/services/dashboard.server';
import { depositOrWithdraw } from '~/features/host/services/wallet.server';
import { authContext } from '~/features/middleware/contexts/auth';
import {
	getRedirectParamFromRequest,
	getSafeRedirectPath,
} from '~/features/middleware/utils/auth-redirect';
import { DEPOSIT } from '~/features/vans/constants/vans-constants';
import { calculateTotalIncome } from '~/utils/calculate-income';
import { getElapsedTime } from '~/utils/get-elapsed-time';
import { getRouteErrorMessage } from '~/utils/get-route-error-message';
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
	const submittedValues = {
		amount: String(formData.amount ?? ''),
		type: String(formData.type ?? DEPOSIT),
	};
	const validation = validateArkType(moneySchema, formData);

	if (!validation.success) {
		return {
			errors: validation.errors.summary,
			formData: submittedValues,
		};
	}

	const { amount, type: transactionType } = validation.data;

	const { error } = await tryCatch(() =>
		depositOrWithdraw(user.id, amount, transactionType)
	);

	if (error) {
		return {
			errors: 'Something went wrong please try again later',
			formData: submittedValues,
		};
	}

	const redirectParam = getRedirectParamFromRequest(request);
	if (transactionType === DEPOSIT && redirectParam) {
		throw redirect(getSafeRedirectPath(redirectParam));
	}
};

const Host = ({ loaderData, actionData }: Route.ComponentProps) => {
	const { vansPromise, avgRating, name, transactions, transactionSummary } =
		loaderData;

	const wallet = useHostWallet(transactionSummary, actionData?.formData?.type);
	const sumIncome = calculateTotalIncome(transactions);
	const { elapsedDays } = getElapsedTime(transactions);

	return (
		<PendingUI as="section">
			<title>Host Dashboard | Van Life</title>
			<meta
				content="Your Van Life host dashboard - manage your vans, view income, and track rentals"
				name="description"
			/>
			<HostIncomeSection
				elapsedDays={elapsedDays}
				isBalancePending={wallet.isPending}
				name={name}
				optimisticBalance={wallet.optimisticBalance}
				sumIncome={sumIncome}
			/>
			<HostReviewSection avgRating={avgRating} />
			<HostWalletForm
				defaultAmount={actionData?.formData?.amount}
				error={actionData?.errors}
				wallet={wallet}
			/>
			<HostVansSection vansPromise={vansPromise} />
		</PendingUI>
	);
};
export default Host;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
	<UnsuccesfulState
		isError
		message={getRouteErrorMessage(error, {
			errorFallback: 'Something went wrong loading your dashboard.',
		})}
	/>
);
