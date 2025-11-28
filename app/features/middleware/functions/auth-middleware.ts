import { href, type MiddlewareFunction, redirect } from 'react-router';
import { auth } from '~/lib/auth.server';
import type { Maybe } from '~/types/types';
import type { Session } from '~/types/types.server';
import { authContext } from '../contexts/auth';

const COOKIE_HEADER = 'Set-Cookie' as const;
export const authMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const responseWithHeaders = await auth.api.getSession({
		headers: request.headers,
		returnHeaders: true,
	});
	const session: Maybe<Session> = responseWithHeaders?.response;

	if (!session) {
		throw redirect(href('/login'));
	}

	context.set(authContext, session);

	// Call next to continue the middleware chain
	const result = await next();

	const headers = responseWithHeaders?.headers;

	const cookies = headers?.get(COOKIE_HEADER);
	if (cookies) {
		result.headers.set(COOKIE_HEADER, cookies);
	}

	return result;
};
