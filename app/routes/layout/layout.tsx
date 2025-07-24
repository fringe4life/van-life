import { Outlet } from 'react-router';
import Nav from '~/components/Nav';
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/layout';

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });
	return session !== null;
}

export default function Layout({ loaderData }: Route.ComponentProps) {
	const hasToken = loaderData;
	return (
		<>
			<Nav hasToken={hasToken} />
			<main className="mb-6 grid grid-rows-subgrid px-2 contain-content sm:px-6">
				<Outlet />
			</main>
			<footer className="w-full bg-neutral-800 py-6.25 contain-strict">
				<p className="text-center text-gray-400 text-sm uppercase">
					&copy;{new Date().getFullYear()} #vanlife
				</p>
				<a
					href="https://www.flaticon.com/free-icons/camper-van"
					title="camper van icons"
					className="inline-block w-full text-center text-gray-400 text-xs"
				>
					Camper van icons created by Iconfromus - Flaticon
				</a>
			</footer>
		</>
	);
}
