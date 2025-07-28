import { data, href, redirect } from 'react-router';
import CustomForm from '~/components/common/CustomForm';
import UnsuccesfulState from '~/components/common/UnsuccesfulState';
import CustomLink from '~/components/navigation/CustomLink';
import { Button } from '~/components/ui/button';
import VanCard from '~/components/van/VanCard';
import { getHostRentedVan } from '~/db/rental/queries';
import { returnVan } from '~/db/rental/transactions';
import { getAccountSummary } from '~/db/user/analytics';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { getCost } from '~/utils/getCost';
import type { Route } from './+types/returnRental';

export function meta({ data }: Route.MetaArgs) {
	const vanName =
		typeof data?.rent === 'object' && data?.rent !== null && 'van' in data.rent
			? data.rent.van.name
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
	const { session, headers } = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) throw data('Rental not found', { status: 404 });

	const results = await Promise.allSettled([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);

	const [rent, money] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);

	if (!rent) throw data('Rented van not found', { status: 404 });

	return data(
		{
			rent: rent as Awaited<ReturnType<typeof getHostRentedVan>> | string,
			money: money as Awaited<ReturnType<typeof getAccountSummary>> | string,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...headers,
			},
		},
	);
}

export async function action({ request, params }: Route.ActionArgs) {
	const { session } = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) throw data('Rental not found', { status: 404 });

	const results = await Promise.allSettled([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);
	const [rent, money] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);
	if (!rent || typeof rent !== 'object' || !('van' in rent))
		throw data('Rented van not found', { status: 404 });
	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van.price);
	const isUnableToPay = typeof money === 'number' ? money < amountToPay : false;

	if (isUnableToPay) {
		return { errors: 'Cannot afford to return this rental' };
	} else {
		const results = await Promise.allSettled([
			returnVan(rentId, session.user.id, amountToPay, rent.van.id),
		]);
		const [returned] = results.map((result) =>
			result.status === 'fulfilled' ? result.value : null,
		);
		if (!returned) {
			return { errors: 'Something went wrong try again later' };
		}
		throw redirect(href('/host'));
	}
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
				message={typeof rent === 'string' ? rent : 'Rental not found'}
				isError
			/>
		);
	}

	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van.price);
	const isUnableToPay = money < amountToPay;
	return (
		<section className="flex flex-col gap-4">
			<h2>Return this van:</h2>
			<div className="max-w-lg">
				<VanCard
					van={rent.van}
					link={href('/host/rentals/returnRental/:rentId', {
						rentId: params.rentId,
					})}
					action={<p></p>}
				/>
			</div>
			{isUnableToPay && (
				<article>
					<p className="text-lg text-red-400">
						You cannot afford to return this van.
					</p>
					<CustomLink to={href('/host/money')}>
						Top up your account <span className="underline">here</span>
					</CustomLink>
				</article>
			)}
			<CustomForm method="POST">
				<Button type="submit" disabled={isUnableToPay}>
					Return
				</Button>
				{actionData?.errors && <p>{actionData.errors}</p>}
			</CustomForm>
		</section>
	);
}
