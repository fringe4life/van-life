import {
	createContext,
	data,
	href,
	isRouteErrorResponse,
	redirect,
} from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { validateCUIDS } from '~/dal/validate-cuids';
import { getHostRentedVan } from '~/features/host/queries/rental/queries';
import { returnVan } from '~/features/host/queries/rental/transactions';
import { getAccountSummary } from '~/features/host/queries/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import VanCard from '~/features/vans/components/van-card';
import { getCost } from '~/features/vans/utils/get-cost';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/return-rental';

/**
 * Shared context for rental and account data.
 * This data is fetched once in middleware and shared between loader and action.
 * The rent is guaranteed to be valid (non-null, non-error) after middleware validation.
 */
interface SharedRentalData {
	rent: NonNullable<
		Exclude<Awaited<ReturnType<typeof getHostRentedVan>>, string>
	>;
	money: number;
}

const sharedRentalDataContext = createContext<SharedRentalData>();

/**
 * Middleware to fetch rental and account data once and share it between loader and action.
 * Runs for both GET (loader) and POST (action) requests.
 */
const fetchSharedDataMiddleware: Route.MiddlewareFunction = async (
	{ params, context },
	next
) => {
	const user = context.get(authContext);

	const [{ data: rent }, { data: money }] = await Promise.all([
		tryCatch(() => validateCUIDS(getHostRentedVan, [0])(params.rentId)),
		tryCatch(() => validateCUIDS(getAccountSummary, [0])(user.id)),
	]);

	if (!rent || typeof rent !== 'object' || !('van' in rent)) {
		throw data('Rented van not found', { status: 404 });
	}

	if (!money) {
		throw data('Account summary not found', { status: 404 });
	}

	context.set(sharedRentalDataContext, { rent, money });

	return next();
};

export const middleware: Route.MiddlewareFunction[] = [
	authMiddleware,
	fetchSharedDataMiddleware,
];

export function loader({ context }: Route.LoaderArgs) {
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
}

export async function action({ params, context }: Route.ActionArgs) {
	const user = context.get(authContext);
	const { rent, money } = context.get(sharedRentalDataContext);

	const { rentId } = params;

	const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
	const isUnableToPay = money < amountToPay;

	if (isUnableToPay) {
		return { errors: 'Cannot afford to return this rental' };
	}

	const { data, error } = await tryCatch(() =>
		returnVan(rentId, user.id, amountToPay, rent.van.id)
	);

	if (error || !data) {
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
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		return <UnsuccesfulState isError message={error.statusText} />;
	}
	if (error instanceof Error) {
		return <UnsuccesfulState isError message={error.message} />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
}
