import { data, Outlet } from 'react-router';
import Nav from '~/features/navigation/components/Nav';
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/layout';

export async function loader({ request }: Route.LoaderArgs) {
	const response = await auth.api.getSession({
		headers: request.headers,
		asResponse: true,
	});
	const session = await response.json();
	return data(session !== null, { headers: response.headers });
}

export default function Layout({ loaderData }: Route.ComponentProps) {
	const hasToken = loaderData;
	return (
		<>
			<Nav hasToken={hasToken} />
			<main className="mb-6 grid grid-rows-subgrid px-[var(--padding-inline)] contain-content">
				<Outlet />
			</main>
			<footer className="grid place-content-center bg-neutral-800 py-6.25 contain-strict">
				<p className="text-center text-gray-400 text-sm uppercase">
					&copy;{new Date().getFullYear()} #vanlife
				</p>
				<a
					className="inline-block w-full break-words text-center text-[.5rem] text-gray-400 xs:text-xs"
					href="https://www.flaticon.com/free-icons/camper-van"
					title="camper van icons"
				>
					Camper van icons created by Iconfromus - Flaticon
				</a>
			</footer>
		</>
	);
}
