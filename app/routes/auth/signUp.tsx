import { href, redirect, replace } from 'react-router';
import { z } from 'zod/v4';
import CustomLink from '~/components/CustomLink';
import CustomForm from '~/components/Form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { auth } from '~/lib/auth.server';
import { signUpScheme } from '~/lib/schemas.server';
import type { Route } from './+types/signUp';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (session) {
		throw redirect(href('/host'));
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = Object.fromEntries(await request.formData());

	const result = signUpScheme.safeParse(formData);

	const name = (formData.name as string) ?? '';
	const email = (formData.email as string) ?? '';

	if (!result.success) {
		return {
			errors: z.prettifyError(result.error),
			name,
			email,
		};
	}
	const signUp = await auth.api.signUpEmail({
		body: result.data,
		asResponse: true,
	});

	if (!signUp.ok) {
		return { errors: 'Sign up failed please try again later', name, email };
	}
	throw replace('/host', {
		headers: signUp.headers,
	});
}

export default function SignUp({ actionData }: Route.ComponentProps) {
	return (
		<div className="grid items-center justify-center gap-4 sm:gap-6 md:gap-12">
			<h2 className="justify-center font-bold text-2xl text-shadow-text sm:text-3xl">
				Create your account
			</h2>
			<CustomForm method="POST" className="grid items-center gap-4">
				<Input
					name="email"
					id="email"
					type="email"
					placeholder="your.email@email.com"
					defaultValue={actionData?.email ?? ''}
				/>
				<Input
					type="text"
					name="name"
					id="name"
					placeholder="John Doe"
					defaultValue={actionData?.name ?? ''}
				/>
				<Input
					name="password"
					id="password"
					type="password"
					placeholder="password"
				/>
				<Input
					name="confirmPassword"
					id="confirmPassword"
					type="password"
					placeholder="confirm password"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button variant="default" type="submit">
					Sign up
				</Button>
			</CustomForm>
			<p>
				<span>Already have an account?</span>{' '}
				<CustomLink to={href('/login')} className="text-orange-400">
					Sign in now
				</CustomLink>
			</p>
		</div>
	);
}
