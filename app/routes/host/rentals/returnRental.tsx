import { data, href, redirect } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { getHostRentedVan } from '~/db/rental/queries';
import { returnVan } from '~/db/rental/transactions';
import { getAccountSummary } from '~/db/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import VanCard from '~/features/vans/components/van-card';
import { getCost } from '~/features/vans/utils/get-cost';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/returnRental';

export function meta({ loaderData }: Route.MetaArgs) {
	const vanName =
		typeof loaderData?.rent === 'object' &&
		loaderData?.rent !== null &&
		'van' in loaderData.rent
			? loaderData.rent.van.name
			: 'Van';
	return [
		{ title: `Return ${vanName} | Vanlife` },
		{
			name: 'description',
			content: "The van you might return to it's owner",
		},
	];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ params, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	const [rentResult, moneyResult] = await Promise.all([
		tryCatch(async () => await getHostRentedVan(params.rentId)),
		tryCatch(async () => await getAccountSummary(session.user.id)),
	]);

	const rent = rentResult.data;
	const money = typeof moneyResult.data === 'number' ? moneyResult.data : 0;

	if (!rent || typeof rent !== 'object' || !('van' in rent)) {
		throw data('Rented van not found', { status: 404 });
	}

	return data(
		{
			rent,
			money,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export async function action({ params, context }: Route.ActionArgs) {
	const session = context.get(authContext);

	const { rentId } = params;

	const [rentResult, moneyResult] = await Promise.all([
		tryCatch(async () => await getHostRentedVan(rentId)),
		tryCatch(async () => await getAccountSummary(session.user.id)),
	]);

	const rent = rentResult.data;
	const money = typeof moneyResult.data === 'number' ? moneyResult.data : 0;

	if (!rent || typeof rent !== 'object' || !('van' in rent)) {
		throw data('Rented van not found', { status: 404 });
	}
	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
	const isUnableToPay = money < amountToPay;

	if (isUnableToPay) {
		return { errors: 'Cannot afford to return this rental' };
	}
	const returnResult = await tryCatch(() =>
		returnVan(rentId, session.user.id, amountToPay, rent.van.id)
	);

	if (returnResult.error || !returnResult.data) {
		return { errors: 'Something went wrong try again later' };
	}
	throw redirect(href('/host'));
}

export default function ReturnRental({
	loaderData,
	actionData,
	params,
}: Route.ComponentProps) {
	const { rent, money } = loaderData;

	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
	const isUnableToPay = money < amountToPay;
	return (
		<section className="flex flex-col gap-4">
			<h2>Return this van:</h2>
			<div className="max-w-lg">
				<VanCard
					action={<p />}
					link={href('/host/rentals/returnRental/:rentId', {
						rentId: params.rentId,
					})}
					van={rent.van}
				/>
			</div>
			{isUnableToPay && (
				<article>
					<p className="text-lg text-red-400">
						You cannot afford to return this van.
					</p>
					<CustomLink
						to={`${href('/host')}?returnTo=${encodeURIComponent(href('/host/rentals/returnRental/:rentId', { rentId: params.rentId }))}`}
					>
						Top up your account <span className="underline">here</span>
					</CustomLink>
				</article>
			)}
			<CustomForm method="POST">
				<Button disabled={isUnableToPay} type="submit">
					Return
				</Button>
				{actionData?.errors && <p>{actionData.errors}</p>}
			</CustomForm>
		</section>
	);
}
