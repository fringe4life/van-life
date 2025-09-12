import { useId } from 'react';
import { href, redirect, replace } from 'react-router';
import { z } from 'zod/v4';
import CustomForm from '~/components/common/CustomForm';
import CustomLink from '~/components/navigation/CustomLink';
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
	const emailId = useId();
	const nameId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	return (
		<div className="grid items-center justify-center gap-4 sm:gap-6 md:gap-12">
			<h2 className="justify-center font-bold text-2xl text-shadow-text sm:text-3xl">
				Create your account
			</h2>
			<CustomForm className="grid items-center gap-4" method="POST">
				<Input
					defaultValue={actionData?.email ?? ''}
					id={emailId}
					name="email"
					placeholder="your.email@email.com"
					type="email"
				/>
				<Input
					defaultValue={actionData?.name ?? ''}
					id={nameId}
					name="name"
					placeholder="John Doe"
					type="text"
				/>
				<Input
					id={passwordId}
					name="password"
					placeholder="password"
					type="password"
				/>
				<Input
					id={confirmPasswordId}
					name="confirmPassword"
					placeholder="confirm password"
					type="password"
				/>
				{actionData?.errors ? <p>{actionData.errors}</p> : null}
				<Button type="submit" variant="default">
					Sign up
				</Button>
			</CustomForm>
			<p>
				<span>Already have an account?</span>{' '}
				<CustomLink className="text-orange-400" to={href('/login')}>
					Sign in now
				</CustomLink>
			</p>
		</div>
	);
}
