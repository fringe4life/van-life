import type { MiddlewareFunction } from 'react-router';
import { auth } from '~/lib/auth.server';
import type { Maybe } from '~/types/types';
import type { Session } from '~/types/types.server';
import { hasAuthContext } from '../contexts/has-auth';
import { setCookieHeaders } from '../utils/set-cookie-headers';

export const hasAuthMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const responseWithHeaders = await auth.api.getSession({
		headers: request.headers,
		returnHeaders: true,
	});
	const session: Maybe<Session> = responseWithHeaders?.response;

	if (session?.user) {
		context.set(hasAuthContext, true);
	} else {
		context.set(hasAuthContext, false);
	}

	// Call next to continue the middleware chain
	const result = await next();

	// If user is logged in, update cookie cache
	if (session?.user) {
		return setCookieHeaders(responseWithHeaders, result);
	}

	return result;
};
