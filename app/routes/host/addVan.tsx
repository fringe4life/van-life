import { useId } from 'react';
import { href, redirect } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/common/CustomForm';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createVan } from '~/db/van/crud';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { addVanSchema } from '~/lib/schemas.server';
import { tryCatch } from '~/lib/tryCatch.server';
import type { Route } from './+types/addVan';
export function meta() {
	return [
		{ title: 'Add Van | Vanlife' },
		{
			name: 'description',
			content: 'the page where you can add a van',
		},
	];
}

export async function action({ request }: Route.ActionArgs) {
	const { session } = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());

	const result = addVanSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			formData,
		};
	}

	const resultWithHostId = { ...result.data, hostId: session.user.id };

	const result2 = await tryCatch(() => createVan(resultWithHostId));

	if (result2.error || !result2.data) {
		return {
			errors: 'Something went wrong please try again later',
			formData,
		};
	}
	throw redirect(href('/host/vans'));
}

export default function AddVan({ actionData }: Route.ComponentProps) {
	const id = useId();
	return (
		<section>
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
				Add Van
			</h2>
			<CustomForm method="POST" className="mt-6 grid max-w-102 gap-4">
				<Input
					type="text"
					name="name"
					placeholder="Silver Bullet"
					defaultValue={(actionData?.formData?.name as string) ?? ''}
				/>
				<Input
					type="number"
					name="price"
					placeholder="100"
					defaultValue={(actionData?.formData?.price as string) ?? ''}
				/>
				<Textarea
					name="description"
					defaultValue={(actionData?.formData?.description as string) ?? ''}
					placeholder="The silver bullet can take you on an amazing adventure..."
				/>
				<Input
					type="url"
					name="imageUrl"
					placeholder="https://images.unsplash.com/"
					defaultValue={(actionData?.formData?.imageUrl as string) ?? ''}
				/>
				<Input
					type="text"
					name="type"
					placeholder="simple or luxury or rugged"
					defaultValue={(actionData?.formData?.type as string) ?? ''}
					list={id}
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
