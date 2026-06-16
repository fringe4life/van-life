import {
	createContext,
	data,
	href,
	isRouteErrorResponse,
	redirect,
} from 'react-router';
import { CustomForm } from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { parseUuidV7 } from '~/dal/parse-uuidv7.server';
import {
	completeReturnRental,
	type HostRentedVan,
	loadReturnRentalContext,
} from '~/features/host/services/rental.server';
import { authContext } from '~/features/middleware/contexts/auth';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { VanCard } from '~/features/vans/components/van-card';
import { getCost } from '~/features/vans/utils/get-cost';
import type { Route } from './+types/return-rental';

interface SharedRentalData {
	money: number;
	rent: HostRentedVan;
}

const sharedRentalDataContext = createContext<SharedRentalData>();

const fetchSharedDataMiddleware: Route.MiddlewareFunction = async (
	{ params, context },
	next
) => {
	const user = context.get(authContext);
	const rentId = parseUuidV7(params.rentId);

	const { rent, money } = await loadReturnRentalContext(rentId, user.id);

	if (!rent || typeof rent !== 'object' || !('van' in rent)) {
		throw data('Rented van not found', { status: 404 });
	}

	if (money === null || money === undefined) {
		throw data('Account summary not found', { status: 404 });
	}

	context.set(sharedRentalDataContext, { rent, money });

	return next();
};

export const middleware: Route.MiddlewareFunction[] = [
	fetchSharedDataMiddleware,
];

export const loader = ({ context }: Route.LoaderArgs) => {
	const { rent, money } = context.get(sharedRentalDataContext);

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
};

export const action = async ({ params, context }: Route.ActionArgs) => {
	const user = context.get(authContext);
	const { rent, money } = context.get(sharedRentalDataContext);

	const result = await completeReturnRental({
		rentId: parseUuidV7(params.rentId),
		userId: user.id,
		rent,
		money,
	});

	if (!result.success) {
		return { errors: result.errors };
	}

	throw redirect(href('/host'));
};

const ReturnRental = ({
	loaderData,
	actionData,
	params,
}: Route.ComponentProps) => {
	const { rent, money } = loaderData;

	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
	const isUnableToPay = money < amountToPay;
	return (
		<section className="flex flex-col gap-4">
			<title>Return {rent.van.name} | Vanlife</title>
			<meta
				content="The van you might return to it's owner"
				name="description"
			/>
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
			{!!isUnableToPay && (
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
				{!!actionData?.errors && <p>{actionData.errors}</p>}
			</CustomForm>
		</section>
	);
};
export default ReturnRental;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
	if (isRouteErrorResponse(error)) {
		return <UnsuccesfulState isError message={error.statusText} />;
	}
	if (error instanceof Error) {
		return <UnsuccesfulState isError message={error.message} />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
};
