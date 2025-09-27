import { href, redirect } from 'react-router';
import type { Session } from '~/types/types.server';
import { auth } from './auth.server';

export async function getSessionOrRedirect(
	request: Request,
	redirectTo = href('/login')
): Promise<{ session: Session; headers: Headers }> {
	const response = await auth.api.getSession({
		headers: request.headers,
		asResponse: true,
	});
	const session: Session = await response.json();

	if (!session) {
		throw redirect(redirectTo, { headers: response.headers });
	}

	return { session, headers: response.headers };
}
