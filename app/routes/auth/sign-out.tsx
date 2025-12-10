import { href, replace } from 'react-router';
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/sign-out';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const response = await auth.api.signOut({
		headers: request.headers,
		asResponse: true,
	});
	throw replace(href('/login'), { headers: response.headers });
};

export default function Signout() {
	return (
		<>
			<title>Sign Out | Van Life</title>
			<meta content="Signing out of your Van Life account" name="description" />
			<p>Signing out</p>
		</>
	);
}
