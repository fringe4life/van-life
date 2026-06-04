import type { Maybe } from '~/types';
import type { AuthenticatedUser } from '~/types/auth.server';

interface HeadersObject {
	headers: Maybe<Headers>;
}

export interface UserAndHeaders extends HeadersObject {
	user: Maybe<AuthenticatedUser>;
}

export interface SetCookieHeaders extends HeadersObject {
	result: Response;
}
