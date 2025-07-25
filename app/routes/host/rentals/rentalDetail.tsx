import { data, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/Form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import VanCard from '~/components/Van/VanCard';
import { getHostRentedVan } from '~/db/host/getHostRentedVan';
import { rentVan } from '~/db/host/rentVan';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { rentVanSchema } from '~/lib/schemas.server';
import type { Route } from './+types/rentalDetail';

export function meta({ data }: Route.MetaArgs) {
	return [
		{ title: `Rent ${data?.rental.van.name} | Vanlife` },
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
	const { headers } = await getSessionOrRedirect(request);
	if (!params.vanId) throw data('Van not found', { status: 404 });

	const rental = await getHostRentedVan(params.vanId);
	if (!rental || typeof rental === 'string')
		throw data('Van not found', { status: 404 });
	return data(
		{
			rental,
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

	const formData = Object.fromEntries(await request.formData());

	const hostId = formData.hostId as string;

	const { vanId } = params;
	if (!vanId) throw data('Rental not found', { status: 404 });

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

	const rental = await rentVan(values.vanId, values.renterId, values.hostId);

	if (!rental) {
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
				van={rental.van}
				link={href('/host/rentals/rent/:vanId', { vanId: rental.van.id })}
				action={<p />}
			/>
			<h2 className="font-bold text-4xl text-neutral-900">Return Van</h2>
			<CustomForm method="POST" className="mt-6 grid max-w-102 gap-4">
				<Input
					type="text"
					defaultValue={rental.hostId}
					className="hidden"
					aria-hidden="true"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Rent {rental.van.name}</Button>
			</CustomForm>
		</section>
	);
}
