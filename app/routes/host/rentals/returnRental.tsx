import { data, Form, href, redirect } from 'react-router';
import CustomLink from '~/components/CustomLink';
import { Button } from '~/components/ui/button';
import VanCard from '~/components/Van/VanCard';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getHostRentedVan } from '~/db/host/getHostRentedVan';
import { returnVan } from '~/db/host/returnVan';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect';
import { getCost } from '~/utils/getCost';
import type { Route } from './+types/returnRental';

export async function loader({ request, params }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) throw data('Rental not found', { status: 404 });

	const [rent, money] = await Promise.all([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);

	if (!rent) throw data('Rented van not found', { status: 404 });

	return data(
		{
			rent,
			money,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export async function action({ request, params }: Route.ActionArgs) {
	const session = await getSessionOrRedirect(request);

	const { rentId } = params;

	if (!rentId) throw data('Rental not found', { status: 404 });

	const [rent, money] = await Promise.all([
		getHostRentedVan(rentId),
		getAccountSummary(session.user.id),
	]);
	if (!rent) throw data('Rented van not found', { status: 404 });
	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van.price);
	const isUnableToPay = money < amountToPay;

	if (isUnableToPay) {
		return { errors: 'Cannot afford to return this rental' };
	} else {
		const [returnedVan, user] = await returnVan(
			rentId,
			session.user.id,
			amountToPay,
			rent.van.id,
		);

		if (!returnedVan || !user) {
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

	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van.price);
	const isUnableToPay = money < amountToPay;
	return (
		<section className="flex flex-col gap-4">
			<h2 className="">Return this van:</h2>
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
			<Form method="POST">
				<Button type="submit" disabled={isUnableToPay}>
					Return
				</Button>
				{actionData?.errors && <p>{actionData.errors}</p>}
			</Form>
		</section>
	);
}
