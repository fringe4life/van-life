import { useId } from 'react';
import { href, redirect, replace } from 'react-router';
import { CustomForm } from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { signUpScheme } from '~/features/auth/schemas.server';
import { hasAuthContext } from '~/features/middleware/contexts/has-auth';
import { hasAuthMiddleware } from '~/features/middleware/functions/has-auth-middleware';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { auth } from '~/lib/auth.server';
import { validateArkType } from '~/utils/parse-arktype.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/sign-up';

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

export const loader = ({ context }: Route.LoaderArgs) => {
	const session = context.get(hasAuthContext);

	if (session) {
		throw redirect(href('/host'));
	}
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = Object.fromEntries(await request.formData());

	const validation = validateArkType(signUpScheme, formData);

	const name = formData.name as string | undefined;
	const email = formData.email as string | undefined;

	if (!validation.success) {
		return {
			email,
			errors: validation.errors.summary,
			name,
		};
	}
	const { data: signUp, error } = await tryCatch(() =>
		auth.api.signUpEmail({
			body: validation.data,
			returnHeaders: true,
		})
	);

	if (!signUp?.response?.token || error) {
		return { email, errors: 'Sign up failed please try again later', name };
	}
	throw replace('/host', {
		headers: signUp.headers,
	});
};

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
			<Card
				className="grid gap-y-4"
				style={{ viewTransitionName: 'auth-card' }}
			>
				<CardHeader>
					<CardTitle style={{ viewTransitionName: 'auth-title' }}>
						Create your account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CustomForm className="grid items-center gap-4" method="POST">
						<Input
							defaultValue={actionData?.email ?? ''}
							id={emailId}
							name="email"
							placeholder="your.email@email.com"
							style={{ viewTransitionName: 'auth-email' }}
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
							style={{ viewTransitionName: 'auth-password' }}
							type="password"
						/>
						<Input
							id={confirmPasswordId}
							name="confirmPassword"
							placeholder="confirm password"
							type="password"
						/>
						{actionData?.errors ? <p>{actionData.errors}</p> : null}
						<Button
							style={{ viewTransitionName: 'auth-submit' }}
							type="submit"
							variant="default"
						>
							Sign up
						</Button>
					</CustomForm>
				</CardContent>
				<CardFooter>
					<p style={{ viewTransitionName: 'auth-footer' }}>
						<span>Already have an account?</span>{' '}
						<CustomLink className="text-orange-400" to={href('/login')}>
							Sign in now
						</CustomLink>
					</p>
				</CardFooter>
			</Card>
		</>
	);
}
