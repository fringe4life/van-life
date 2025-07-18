import { redirect } from 'react-router';
import { auth } from '~/lib/auth/auth';
import type { Route } from './+types/signOut';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const response = await auth.api.revokeSessions({
		headers: request.headers,
		asResponse: true,
	});
	throw redirect('/login', { headers: response.headers });
};

export default function Signout() {
	return <p>Signing out</p>;
}
