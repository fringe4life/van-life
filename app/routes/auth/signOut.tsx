import { replace } from 'react-router';
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/signOut';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const response = await auth.api.signOut({
		headers: request.headers,
		asResponse: true,
	});
	throw replace('/login', { headers: response.headers });
};

export default function Signout() {
	return <p>Signing out</p>;
}
