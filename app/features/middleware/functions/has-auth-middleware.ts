import type { MiddlewareFunction } from 'react-router';
import { hasAuthContext } from '../contexts/has-auth';
import { getUser } from '../utils/get-user';
import { setCookieHeaders } from '../utils/set-cookie-headers';

export const hasAuthMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const { user, headers } = await getUser(request);

	if (user) {
		context.set(hasAuthContext, true);
	} else {
		context.set(hasAuthContext, false);
	}

	// Call next to continue the middleware chain
	const result = await next();

	// If user is logged in, update cookie cache
	if (user) {
		return setCookieHeaders(headers, result);
	}

	return result;
};
