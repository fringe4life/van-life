import { data, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/CustomForm';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { getHostRentedVan } from '~/db/rental/queries';
import { rentVan } from '~/db/rental/transactions';
import VanCard from '~/features/vans/components/VanCard';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { rentVanSchema } from '~/lib/schemas.server';
import { tryCatch } from '~/utils/tryCatch.server';
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

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const { headers: cookies } = await getSessionOrRedirect(request);
	if (!params.vanId) {
		throw data('Van not found', { status: 404 });
	}

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
				...cookies,
			},
		}
	);
}

export async function action({ request, params }: Route.ActionArgs) {
	const { session } = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());

	const hostId = formData.hostId as string;

	const { vanId } = params;
	if (!vanId) {
		throw data('Rental not found', { status: 404 });
	}

	const {
		success,
		data: values,
		error,
	} = rentVanSchema.safeParse({
		vanId,
		renterId: session.user.id,
		hostId,
	});

	if (!success) {
		return {
			errors: z.prettifyError(error),
			formData,
		};
	}

	const result = await tryCatch(() =>
		rentVan(values.vanId, values.renterId, values.hostId)
	);

	if (result.error || !result.data) {
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
