import { Form, href, redirect } from 'react-router';
import { z } from 'zod/v4';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import type { returnVan } from '~/db/host/returnVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { uuidSchema } from '~/utils/types.server';
import type { Route } from './+types/rentalDetail';

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

export default function AddVan({ actionData }: Route.ComponentProps) {
	const { usingForm } = useIsNavigating();
	return (
		<section>
			<h2 className="font-bold text-4xl text-text">Add Van</h2>
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
					placeholder="https://plus.unsplash.com/"
					defaultValue={(actionData?.formData?.imageUrl as string) ?? ''}
				/>
				<Input
					type="text"
					name="type"
					placeholder="simple or luxury or rugged"
					defaultValue={(actionData?.formData?.type as string) ?? ''}
					list="vanTypeList"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit" disabled={usingForm}>
					Submit your review
				</Button>
			</Form>
		</section>
	);
}
