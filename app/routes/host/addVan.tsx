import { type } from 'arktype';
import { useId } from 'react';
import { href, redirect } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createVan } from '~/db/van/crud';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { addVanSchema } from '~/lib/schemas.server';
import { getSlug } from '~/utils/get-slug';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/addVan';
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function action({ request, context }: Route.ActionArgs) {
	const session = context.get(authContext);

	const formData = Object.fromEntries(await request.formData());

	const result = addVanSchema(formData);

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			formData,
		};
	}

	const resultWithHostId = {
		...result,
		slug: getSlug(result.name),
		discount: result.discount ?? 0,
		hostId: session.user.id,
		state: result.state ?? null,
	};

	const result2 = await tryCatch(() => createVan(resultWithHostId));

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
	throw redirect(href('/host/vans/:vanSlug?/:action?'));
}

export default function AddVan({ actionData }: Route.ComponentProps) {
	const id = useId();
	return (
		<section>
			<title>Add Van | Van Life</title>
			<meta
				content="Add a new van to your Van Life listings"
				name="description"
			/>
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
				Add Van
			</h2>
			<CustomForm className="mt-6 grid max-w-102 gap-4" method="POST">
				<Input
					defaultValue={(actionData?.formData?.name as string) ?? ''}
					name="name"
					placeholder="Silver Bullet"
					type="text"
				/>
				<Input
					defaultValue={(actionData?.formData?.price as string) ?? ''}
					name="price"
					placeholder="100"
					type="number"
				/>
				<Textarea
					defaultValue={(actionData?.formData?.description as string) ?? ''}
					name="description"
					placeholder="The silver bullet can take you on an amazing adventure..."
				/>
				<Input
					defaultValue={(actionData?.formData?.imageUrl as string) ?? ''}
					name="imageUrl"
					placeholder="https://images.unsplash.com/"
					type="url"
				/>
				<Input
					defaultValue={(actionData?.formData?.type as string) ?? ''}
					list={id}
					name="type"
					placeholder="simple or luxury or rugged"
					type="text"
				/>
				<datalist id={id}>
					<option value="luxury" />
					<option value="simple" />
					<option value="rugged" />
				</datalist>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Add your van</Button>
			</CustomForm>
		</section>
	);
}
