import type { MiddlewareFunction } from 'react-router';
import { hasAuthContext } from '~/features/middleware/contexts/has-auth';
import { getUserWithHeaders } from '~/features/middleware/utils/get-user-with-headers';
import { setCookieHeaders } from '~/features/middleware/utils/set-cookie-headers';

const hasAuthMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const { user, headers } = await getUserWithHeaders(request);

	if (user) {
		context.set(hasAuthContext, true);
	} else {
		context.set(hasAuthContext, false);
	}

	// Call next to continue the middleware chain
	const result = await next();

	// If user is logged in, update cookie cache
	if (user) {
		return setCookieHeaders({ headers, result });
	}

	return result;
};

export { hasAuthMiddleware };
