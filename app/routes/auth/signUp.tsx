import { Form, href, replace } from 'react-router';
import { z } from 'zod/v4';
import CustomLink from '~/components/CustomLink';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useIsNavigating from '~/hooks/useIsNavigating';
import { auth } from '~/lib/auth';
import { signUpScheme } from '~/utils/schema';
import type { Route } from './+types/signUp';

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
	const { usingForm } = useIsNavigating();

	return (
		<div className="grid items-center justify-center gap-4 sm:gap-6 md:gap-12">
			<h2 className="justify-center font-bold text-2xl text-shadow-text sm:text-3xl">
				Create your account
			</h2>
			<Form method="POST" className="grid gap-4">
				<Input
					name="email"
					id="email"
					type="email"
					placeholder="your.email@email.com"
					disabled={usingForm}
					defaultValue={actionData?.email ?? ''}
				/>
				<Input
					type="text"
					name="name"
					id="name"
					placeholder="John Doe"
					disabled={usingForm}
					defaultValue={actionData?.name ?? ''}
				/>
				<Input
					name="password"
					id="password"
					type="password"
					placeholder="password"
					disabled={usingForm}
				/>
				<Input
					name="confirmPassword"
					id="confirmPassword"
					type="password"
					placeholder="confirm password"
					disabled={usingForm}
				/>
				{actionData?.errors ? <p>actionData.errors</p> : null}
				<Button variant="default" type="submit" disabled={usingForm}>
					Sign up
				</Button>
			</Form>
			<p>
				<span>Already have an account?</span>{' '}
				<CustomLink to={href('/login')} className="text-orange-400">
					Sign in now
				</CustomLink>
			</p>
		</div>
	);
}
