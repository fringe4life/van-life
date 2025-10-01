import { type } from 'arktype';
import { data, href, redirect } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { getHostRentedVan } from '~/db/rental/queries';
import { rentVan } from '~/db/rental/transactions';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import VanCard from '~/features/vans/components/van-card';
import { rentVanSchema } from '~/lib/schemas.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/rentalDetail';

export function meta({ loaderData }: Route.MetaArgs) {
	return [
		{ title: `Rent ${loaderData?.rental.van.name} | Vanlife` },
		{
			name: 'description',
			content: 'The van you might rent',
		},
	];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ params }: Route.LoaderArgs) {
	// No session needed for this loader, but middleware ensures auth

	const result = await tryCatch(() => getHostRentedVan(params.vanId));

	if (result.error) {
		throw data('Failed to load rental details. Please try again later.', {
			status: 500,
		});
	}

	if (!result.data || typeof result.data === 'string') {
		throw data('Van not found', { status: 404 });
	}

	return data(
		{
			rental: result.data,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export async function action({ request, params, context }: Route.ActionArgs) {
	const session = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());

	const hostId = formData.hostId as string;

	const { vanId } = params;
	if (!vanId) {
		throw data('Rental not found', { status: 404 });
	}

	const result = rentVanSchema({
		vanId,
		renterId: session.user.id,
		hostId,
	});

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			formData,
		};
	}

	const result2 = await tryCatch(() =>
		rentVan(result.vanId, result.renterId, result.hostId)
	);

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong try again later!',
			formData,
		};
	}
	throw redirect(href('/host/rentals'));
}

export default function AddVan({
	actionData,
	loaderData,
}: Route.ComponentProps) {
	const { rental } = loaderData;

	return (
		<section>
			<VanCard
				action={<p />}
				link={href('/host/rentals/rent/:vanId', { vanId: rental.van.id })}
				van={rental.van}
			/>
			<h2 className="font-bold text-4xl text-neutral-900">Return Van</h2>
			<CustomForm className="mt-6 grid max-w-102 gap-4" method="POST">
				<Input
					aria-hidden="true"
					className="hidden"
					defaultValue={rental.hostId}
					type="text"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Rent {rental.van.name}</Button>
			</CustomForm>
		</section>
	);
}
