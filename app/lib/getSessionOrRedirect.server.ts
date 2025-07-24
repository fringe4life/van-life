import { href, redirect } from 'react-router';
import { auth } from './auth.server';

type Session = typeof auth.$Infer.Session;

export async function getSessionOrRedirect(
	request: Request,
	redirectTo = href('/login'),
): Promise<{ session: Session; headers: Headers }> {
	const response = await auth.api.getSession({
		headers: request.headers,
		asResponse: true,
	});
	const session: Session = await response.json();

	if (!session) throw redirect(redirectTo, { headers: response.headers });

	return { session, headers: response.headers };
}
