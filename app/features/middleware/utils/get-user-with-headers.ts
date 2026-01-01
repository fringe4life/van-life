import type { UserAndHeaders } from '~/features/middleware/types';
import { auth } from '~/lib/auth.server';
import { tryCatch } from '~/utils/try-catch.server';

const getUserWithHeaders = async (
	request: Request
): Promise<UserAndHeaders> => {
	const { data: responseWithHeaders } = await tryCatch(() =>
		auth.api.getSession({
			headers: request.headers,
			returnHeaders: true,
		})
	);
	const user = responseWithHeaders?.response?.user;
	const headers = responseWithHeaders?.headers;

	return { user, headers };
};

export { getUserWithHeaders };
