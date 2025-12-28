import { data, href, replace } from 'react-router';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { auth } from '~/lib/auth.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/sign-out';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { data: signOut, error } = await tryCatch(() =>
		auth.api.signOut({
			headers: request.headers,
			returnHeaders: true,
		})
	);
	if (!signOut?.response?.success || error) {
		throw data('Failed to sign out. Please try again later.', { status: 500 });
	}
	throw replace(href('/login'), { headers: signOut.headers });
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

export const ErrorBoundary = () => (
	<UnsuccesfulState isError message="Your signout failed, please try again." />
);
