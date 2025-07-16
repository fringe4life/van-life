import { data, Form, href } from 'react-router';
import { z } from 'zod/v4';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import VanCard from '~/components/Van/VanCard';
import { getHostRentedVan } from '~/db/host/getHostRentedVan';
import { rentVan } from '~/db/host/rentVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { rentVanSchema } from '~/utils/schema';
import type { Route } from './+types/rentalDetail';

export async function loader({ params, request }: Route.LoaderArgs) {
	await getSessionOrRedirect(request);
	console.log({ vanId: params.vanId });
	if (!params.vanId) throw data('Van not found', { status: 404 });

	const rental = await getHostRentedVan(params.vanId);
	console.log();
	if (!rental) throw data('Van not found', { status: 404 });
	return data(
		{
			rental,
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
}

export default function AddVan({
	actionData,
	loaderData,
}: Route.ComponentProps) {
	const { usingForm } = useIsNavigating();

	const { rental } = loaderData;

	return (
		<section>
			<VanCard
				van={rental}
				link={href('/host/rentals/rent/:vanId', { vanId: rental.id })}
				action={<p />}
			/>
			<h2 className="font-bold text-4xl text-text">Return Van</h2>
			<Form method="POST" className="mt-6 grid max-w-102 gap-4">
				<Input
					type="text"
					defaultValue={rental.hostId}
					className="hidden"
					aria-hidden="true"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit" disabled={usingForm}>
					Rent {rental.name}
				</Button>
			</Form>
		</section>
	);
}
