import { href, type MiddlewareFunction, redirect } from 'react-router';
import { authContext } from '../contexts/auth';
import { getUser } from '../utils/get-user';
import { setCookieHeaders } from '../utils/set-cookie-headers';

export const authMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const { user, responseWithHeaders } = await getUser(request);

	if (!user) {
		throw redirect(href('/login'));
	}

	context.set(authContext, user);

	// Call next to continue the middleware chain
	const result = await next();

	// Set cookie headers to update cookie cache
	return setCookieHeaders(responseWithHeaders, result);
};
