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
import { loginSchema } from '~/features/auth/schemas.server';
import { hasAuthContext } from '~/features/middleware/contexts/has-auth';
import { hasAuthMiddleware } from '~/features/middleware/functions/has-auth-middleware';
import {
	getRedirectFromRequest,
	getSafeRedirectPath,
} from '~/features/middleware/utils/auth-redirect';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { auth } from '~/lib/auth.server';
import { validateArkType } from '~/utils/parse-arktype.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/login';

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

export function loader({ context, request }: Route.LoaderArgs) {
	const hasAuth = context.get(hasAuthContext);
	const redirectTo = getRedirectFromRequest(request);

	if (hasAuth) {
		throw redirect(redirectTo);
	}

	return { redirectTo };
}

export async function action({ request }: Route.ActionArgs) {
	const formData = Object.fromEntries(await request.formData());

	const validation = validateArkType(loginSchema, formData);

	if (!validation.success) {
		return {
			errors: validation.errors.summary,
			email: (formData.email as string | undefined) ?? '',
		};
	}
	const { data: login, error } = await tryCatch(() =>
		auth.api.signInEmail({
			body: validation.data,
			returnHeaders: true,
		})
	);

	if (!login?.response?.token || error) {
		return {
			errors: 'Your email or password is incorrect',
			email: (formData.email as string | undefined) ?? '',
		};
	}
	const redirectTo = getSafeRedirectPath(formData.redirectTo);

	throw replace(redirectTo, {
		headers: login.headers,
	});
}

export default function Login({
	actionData,
	loaderData,
}: Route.ComponentProps) {
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
						<input
							name="redirectTo"
							type="hidden"
							value={loaderData.redirectTo}
						/>
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
