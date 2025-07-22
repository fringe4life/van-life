import { Form, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createVan } from '~/db/createVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect';
import { addVanSchema } from '~/utils/schema';
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
	const session = await getSessionOrRedirect(request);

	const formData = Object.fromEntries(await request.formData());

	const result = addVanSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			formData,
		};
	}

	const resultWithHostId = { ...result.data, hostId: session.user.id };

	const success = await createVan(resultWithHostId);

	if (!success) {
		return {
			errors: "Something wen't wrong please try again later",
			formData,
		};
	}
	throw redirect(href('/host/vans'));
}

export default function AddVan({ actionData }: Route.ComponentProps) {
	const { usingForm } = useIsNavigating();
	return (
		<section>
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
				Add Van
			</h2>
			<Form method="POST" className="mt-6 grid max-w-102 gap-4">
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
					list="vanTypeList"
				/>
				<datalist id="vantypeList">
					<option value="LUXURY" />
					<option value="SIMPLE" />
					<option value="RUGGED" />
				</datalist>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit" disabled={usingForm}>
					Add your van
				</Button>
			</Form>
		</section>
	);
}
