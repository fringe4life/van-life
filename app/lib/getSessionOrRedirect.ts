import { href, redirect } from 'react-router';
import { auth } from './auth.server';
export async function getSessionOrRedirect(
	request: Request,
	redirectTo = href('/login'),
) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) throw redirect(redirectTo, { headers: request.headers });

	return session;
}
