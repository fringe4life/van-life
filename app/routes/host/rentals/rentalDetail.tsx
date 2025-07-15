import type { Van } from '@prisma/client';
import { data, Form, href, redirect, useLocation } from 'react-router';
import { z } from 'zod/v4';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import VanCard from '~/components/Van/VanCard';
import { getHostRentedVan } from '~/db/host/getHostRentedVan';
import type { returnVan } from '~/db/host/returnVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { getCost } from '~/utils/getCost';
import { uuidSchema } from '~/utils/types';
import type { Route } from './+types/rentalDetail';

export async function loader({ params, request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const rentId = params.rentalId;
	if (!rentId) throw data('Rental not found', { status: 404 });

	const rental = await getHostRentedVan(rentId);

	if (!rental) throw data('Rental not found', { status: 404 });

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

export async function action({ request }: Route.ActionArgs) {
	const session = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());

	const result = uuidSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			formData,
		};
	}

	// const success = await returnVan(resultWithHostId);

	// if (!success) {
	// 	return {
	// 		errors: "Something wen't wrong please try again later",
	// 		formData,
	// 	};
	// }
	// throw redirect(href('/host/vans'));
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
				van={rental.van}
				link={href('/host/rentals/:rentalId', { rentalId: rental.id })}
				action={<p />}
			/>
			<h2 className="font-bold text-4xl text-text">Return Van</h2>
			<Form method="POST" className="mt-6 grid max-w-102 gap-4">
				<Input
					defaultValue={rental.id}
					name="possibleUUID"
					className="hidden"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit" disabled={usingForm}>
					Return {rental.van.name}
				</Button>
			</Form>
		</section>
	);
}
