import { auth } from '~/lib/auth.server';
import type { Maybe } from '~/types/types';
import type { User } from '~/types/types.server';
import { tryCatch } from '~/utils/try-catch.server';

export const getUser = async (
	request: Request
): Promise<{ user: Maybe<User>; headers: Maybe<Headers> }> => {
	const { data: responseWithHeaders } = await tryCatch(
		async () =>
			await auth.api.getSession({
				headers: request.headers,
				returnHeaders: true,
			})
	);
	const user: Maybe<User> = responseWithHeaders?.response?.user;
	const headers: Maybe<Headers> = responseWithHeaders?.headers;

	return { user, headers };
};
