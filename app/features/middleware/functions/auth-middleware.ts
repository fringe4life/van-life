import { href, type MiddlewareFunction, redirect } from 'react-router';
import { auth } from '~/lib/auth.server';
import type { Session } from '~/types/types.server';
import { authContext } from '../contexts/auth';

export const authMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const response = await auth.api.getSession({
		headers: request.headers,
		asResponse: true,
	});
	const session: Session | null = await response.json();
	if (!session) {
		throw redirect(href('/login'));
	}

	context.set(authContext, session);

	// Call next to continue the middleware chain
	const result = await next();

	// Set cookies from the auth response
	if (response.headers.get('Set-Cookie')) {
		result.headers.set('Set-Cookie', response.headers.get('Set-Cookie') ?? '');
	}

	return result;
};
