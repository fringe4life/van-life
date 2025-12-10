import type { Maybe } from '~/types/types';
import type { Session } from '~/types/types.server';
import { COOKIE_HEADER } from '../constants';

/**
 * Sets cookie headers from session response headers onto the result response.
 * Used to update cookie cache when a user is logged in.
 */
export function setCookieHeaders(
	responseWithHeaders: { headers: Headers; response: Maybe<Session> },
	result: Response
): Response {
	if (!responseWithHeaders?.headers) {
		return result;
	}

	const cookies = responseWithHeaders.headers.get(COOKIE_HEADER);
	if (cookies) {
		result.headers.set(COOKIE_HEADER, cookies);
	}

	return result;
}
