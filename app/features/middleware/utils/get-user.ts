import { auth } from '~/lib/auth.server';
import type { Maybe } from '~/types/types';
import type { Session } from '~/types/types.server';
import { tryCatch } from '~/utils/try-catch.server';

export const getUser = async (request: Request) => {
	const { data: responseWithHeaders } = await tryCatch(
		async () =>
			await auth.api.getSession({
				headers: request.headers,
				returnHeaders: true,
			})
	);
	const session: Maybe<Session> = responseWithHeaders?.response;

	return { user: session?.user, responseWithHeaders };
};
