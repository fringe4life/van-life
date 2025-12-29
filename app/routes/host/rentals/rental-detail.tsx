import { type } from 'arktype';
import { data, href, isRouteErrorResponse, redirect } from 'react-router';
import { CustomForm } from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { rentVan } from '~/features/host/queries/rental/transactions';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { VanCard } from '~/features/vans/components/van-card';
import { getVanBySlug } from '~/features/vans/queries/queries';
import { rentVanSchema } from '~/lib/schemas';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/rental-detail';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export const loader = async ({ params }: Route.LoaderArgs) => {
	const result = await tryCatch(() => getVanBySlug(params.vanSlug));

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
};

export const action = async ({
	request,
	params,
	context,
}: Route.ActionArgs) => {
	const user = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());

	const hostId = formData.hostId as string;

	const result = rentVanSchema({
		vanSlug: params.vanSlug,
		renterId: user.id,
		hostId,
	});

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			formData,
		};
	}

	const result2 = await tryCatch(() =>
		rentVan(result.vanSlug, result.renterId, result.hostId)
	);

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong try again later!',
			formData,
		};
	}
	throw redirect(href('/host/rentals'));
};

const AddVan = ({ actionData, loaderData, params }: Route.ComponentProps) => {
	const { rental } = loaderData;

	return (
		<section>
			<title>Rent {rental.name} | Vanlife</title>
			<meta content="The van you might rent" name="description" />
			<VanCard
				action={<p />}
				link={href('/host/rentals/rent/:vanSlug', { vanSlug: params.vanSlug })}
				van={rental}
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
				<Button type="submit">Rent {rental.name}</Button>
			</CustomForm>
		</section>
	);
};

export default AddVan;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
	if (isRouteErrorResponse(error)) {
		return <UnsuccesfulState isError message={error.statusText} />;
	}
	if (error instanceof Error) {
		return <UnsuccesfulState isError message={error.message} />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
};
