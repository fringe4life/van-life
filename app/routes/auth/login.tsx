import { type } from 'arktype';
import { useId } from 'react';
import { href, redirect, replace } from 'react-router';
import CustomForm from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { hasAuthContext } from '~/features/middleware/contexts/has-auth';
import { hasAuthMiddleware } from '~/features/middleware/functions/has-auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import { auth } from '~/lib/auth.server';
import { loginSchema } from '~/lib/schemas';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/login';

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

export function loader({ context }: Route.LoaderArgs) {
	const hasAuth = context.get(hasAuthContext);
	if (hasAuth) {
		throw redirect(href('/host'));
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = Object.fromEntries(await request.formData());

	const result = loginSchema(formData);

	if (result instanceof type.errors) {
		return {
			errors: result.summary,
			email: (formData.email as string | undefined) ?? '',
		};
	}
	const { data: login, error } = await tryCatch(() =>
		auth.api.signInEmail({
			body: result,
			returnHeaders: true,
		})
	);

	if (!login?.response?.token || error) {
		return {
			errors: 'Your email or password is incorrect',
			email: (formData.email as string | undefined) ?? '',
		};
	}
	throw replace(href('/host'), {
		headers: login.headers,
	});
}

export default function Login({ actionData }: Route.ComponentProps) {
	const emailId = useId();
	const passwordId = useId();

	return (
		<>
			<title>Sign In | Van Life</title>
			<meta
				content="Sign in to your Van Life account to manage your van rentals and bookings"
				name="description"
			/>
			<Card className="grid gap-y-4">
				<CardHeader>
					<CardTitle>Sign into your account</CardTitle>
				</CardHeader>
				<CardContent>
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
				</CardContent>
				<CardFooter>
					<p>
						<span>Don't have an account?</span>{' '}
						<CustomLink className="text-orange-400" to={href('/signup')}>
							Create one now
						</CustomLink>
					</p>
				</CardFooter>
			</Card>
		</>
	);
}
