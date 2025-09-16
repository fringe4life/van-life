import { useId } from 'react';
import { href, redirect, replace } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import CustomLink from '~/features/navigation/components/custom-link';
import { auth } from '~/lib/auth.server';
import { loginSchema } from '~/lib/schemas.server';
import type { Route } from './+types/login';

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const result = await auth.api.getSession({ headers: request.headers });
	if (result) {
		throw redirect('/host');
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = Object.fromEntries(await request.formData());

	const result = loginSchema.safeParse(formData);

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			email: (formData.email as string) ?? '',
		};
	}
	const response = await auth.api.signInEmail({
		body: result.data,
		asResponse: true,
	});

	if (!response.ok) {
		return {
			errors: 'Your email or password is incorrect',
			email: (formData.email as string) ?? '',
		};
	}
	throw replace('/host', {
		headers: response.headers,
	});
}

export default function Login({ actionData }: Route.ComponentProps) {
	const emailId = useId();
	const passwordId = useId();

	return (
		<div className="grid items-center justify-center gap-4 sm:gap-6 md:gap-12">
			<h2 className="font-bold text-2xl text-shadow-text sm:text-3xl">
				Sign into your account
			</h2>
			<CustomForm className="grid items-center gap-4" method="POST">
				<Input
					autoFocus
					defaultValue={actionData?.email ?? ''}
					id={emailId}
					name="email"
					placeholder="john.doe@email.com"
					type="email"
				/>
				<Input
					defaultValue=""
					id={passwordId}
					name="password"
					placeholder="password"
					type="password"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit">Sign in</Button>
			</CustomForm>
			<p>
				<span>Don't have an account?</span>{' '}
				<CustomLink className="text-orange-400" to={href('/signup')}>
					Create one now
				</CustomLink>
			</p>
		</div>
	);
}
