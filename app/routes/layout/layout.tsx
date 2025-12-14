import { data, Outlet } from 'react-router';
import { hasAuthContext } from '~/features/middleware/contexts/has-auth';
import { hasAuthMiddleware } from '~/features/middleware/functions/has-auth-middleware';
import Nav from '~/features/navigation/components/nav';
import type { Route } from './+types/layout';

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

export function loader({ context }: Route.LoaderArgs) {
	const hasAuth = context.get(hasAuthContext);
	return data(hasAuth);
}

export default function Layout({ loaderData }: Route.ComponentProps) {
	const hasToken = loaderData;
	return (
		<>
			<Nav hasToken={hasToken} />
			<main className="col-start-2 col-end-3 row-start-2 mb-6">
				<Outlet />
			</main>
			<footer className="col-span-full row-start-3 grid place-content-center bg-neutral-800 py-6.25 contain-strict">
				<p className="text-center text-gray-400 text-sm uppercase">
					&copy;{new Date().getFullYear()} #vanlife
				</p>
				<a
					className="wrap-break-word inline-block w-full text-center text-[.5rem] text-gray-400 xs:text-xs"
					href="https://www.flaticon.com/free-icons/camper-van"
					title="camper van icons"
				>
					Camper van icons created by Iconfromus - Flaticon
				</a>
			</footer>
		</>
	);
}
