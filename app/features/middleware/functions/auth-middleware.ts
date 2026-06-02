import { type MiddlewareFunction, redirect } from 'react-router';
import { authContext } from '~/features/middleware/contexts/auth';
import {
	getLoginRedirectUrl,
	getReturnPathFromRequest,
} from '~/features/middleware/utils/auth-redirect';
import { getUserWithHeaders } from '~/features/middleware/utils/get-user-with-headers';
import { setCookieHeaders } from '~/features/middleware/utils/set-cookie-headers';

const authMiddleware: MiddlewareFunction<Response> = async (
	{ request, context },
	next
) => {
	const { user, headers } = await getUserWithHeaders(request);

	if (!user) {
		const returnPath = getReturnPathFromRequest(request);
		throw redirect(getLoginRedirectUrl(returnPath));
	}

	context.set(authContext, user);

	// Call next to continue the middleware chain
	const result = await next();

	// Set cookie headers to update cookie cache
	return setCookieHeaders({ headers, result });
};

export { authMiddleware };
