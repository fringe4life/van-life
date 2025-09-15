import { data, href, redirect } from 'react-router';
import CustomForm from '~/components/CustomForm';
import UnsuccesfulState from '~/components/UnsuccesfulState';
import { Button } from '~/components/ui/button';
import { getHostRentedVan } from '~/db/rental/queries';
import { returnVan } from '~/db/rental/transactions';
import { getAccountSummary } from '~/db/user/analytics';
import CustomLink from '~/features/navigation/components/CustomLink';
import VanCard from '~/features/vans/components/VanCard';
import { getCost } from '~/features/vans/utils/getCost';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import type { QueryType } from '~/types/types.server';
import { tryCatch } from '~/utils/tryCatch.server';
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

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) {
		throw data('Rental not found', { status: 404 });
	}

	const results = await Promise.allSettled([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);

	const [rent, money] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data'
	);

	if (!rent) {
		throw data('Rented van not found', { status: 404 });
	}

	return data(
		{
			rent: rent as QueryType<typeof getHostRentedVan> | string,
			money: money as QueryType<typeof getAccountSummary> | string,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...cookies,
			},
		}
	);
}

export async function action({ request, params }: Route.ActionArgs) {
	const { session } = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) {
		throw data('Rental not found', { status: 404 });
	}

	const initialResults = await Promise.allSettled([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);
	const [rent, money] = initialResults.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data'
	);
	if (!rent || typeof rent !== 'object' || !('van' in rent)) {
		throw data('Rented van not found', { status: 404 });
	}
	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
	const isUnableToPay = typeof money === 'number' ? money < amountToPay : false;

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

	if (!rent || typeof rent === 'string' || typeof money === 'string') {
		return (
			<UnsuccesfulState
				isError
				message={typeof rent === 'string' ? rent : 'Rental not found'}
			/>
		);
	}

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
						to={`${href('/host/money')}?returnTo=${encodeURIComponent(href('/host/rentals/returnRental/:rentId', { rentId: params.rentId }))}`}
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
