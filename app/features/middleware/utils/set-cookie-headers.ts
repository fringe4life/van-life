import type { Maybe } from '~/types/types';
import { COOKIE_HEADER } from '../constants';

/**
 * Sets cookie headers from session response headers onto the result response.
 * Used to update cookie cache when a user is logged in.
 */
export const setCookieHeaders = (
	headers: Maybe<Headers>,
	result: Response
): Response => {
	if (!headers) {
		return result;
	}

	const cookies: Maybe<string> = headers.get(COOKIE_HEADER);
	if (cookies) {
		result.headers.set(COOKIE_HEADER, cookies);
	}

	return result;
};
