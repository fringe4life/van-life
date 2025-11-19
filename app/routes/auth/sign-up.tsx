import { type } from 'arktype';
import { useId } from 'react';
import { href, redirect, replace } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import CustomLink from '~/features/navigation/components/custom-link';
import { auth } from '~/lib/auth.server';
import { signUpScheme } from '~/lib/schemas.server';
import type { Route } from './+types/sign-up';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (session) {
		throw redirect(href('/host'));
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = Object.fromEntries(await request.formData());

	const result = signUpScheme(formData);

	const name = (formData.name as string) ?? '';
	const email = (formData.email as string) ?? '';

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			name,
			email,
		};
	}
	const signUp = await auth.api.signUpEmail({
		body: result,
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
		<>
			<title>Sign Up | Van Life</title>
			<meta
				content="Create a Van Life account to start renting vans and managing your bookings"
				name="description"
			/>
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
		</>
	);
}
