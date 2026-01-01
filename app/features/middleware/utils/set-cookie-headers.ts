import { COOKIE_HEADER } from '~/features/middleware/constants';
import type { SetCookieHeaders } from '~/features/middleware/types';

/**
 * Sets cookie headers from session response headers onto the result response.
 * Used to update cookie cache when a user is logged in.
 */
const setCookieHeaders = ({ headers, result }: SetCookieHeaders): Response => {
	if (!headers) {
		return result;
	}

	const cookies = headers.get(COOKIE_HEADER);
	if (cookies) {
		result.headers.set(COOKIE_HEADER, cookies);
	}

	return result;
};

export { setCookieHeaders };
