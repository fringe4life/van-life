import type { Maybe } from '~/types';
import type { User } from '~/types/index.server';

interface HeadersObject {
	headers: Maybe<Headers>;
}

export interface UserAndHeaders extends HeadersObject {
	user: Maybe<User>;
}

export interface SetCookieHeaders extends HeadersObject {
	result: Response;
}
