import type { Maybe } from '~/types/types';
import type { User } from '~/types/types.server';

interface HeadersObject {
	headers: Maybe<Headers>;
}

export interface UserAndHeaders extends HeadersObject {
	user: Maybe<User>;
}

export interface SetCookieHeaders extends HeadersObject {
	result: Response;
}
