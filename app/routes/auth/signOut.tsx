import { replace } from 'react-router';
import { auth } from '~/lib/auth/auth';
import type { Route } from './+types/signOut';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const response = await auth.api.revokeSessions({
		headers: request.headers,
		asResponse: true,
	});
	throw replace('/login', { headers: response.headers });
};

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function Signout() {
	return <p>Signing out</p>;
}
