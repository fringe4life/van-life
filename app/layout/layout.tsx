import { href, Outlet } from 'react-router';
import CustomLink from '~/components/CustomLink';
import CustomNavLink from '~/components/CustomNavLink';
import { authClient } from '~/lib/auth/client';

export default function Layout() {
	const { data } = authClient.useSession();

	const hasToken = data?.session !== undefined;
	return (
		<>
			<header className="flex items-center justify-between gap-3 py-9 sm:gap-6">
				<h1 className="font-black text-2xl uppercase">
					<CustomLink to={href('/')}>#vanlife</CustomLink>
				</h1>
				<nav>
					<ul className="flex flex-wrap justify-end gap-2 sm:flex-nowrap sm:gap-3">
						<li>
							<CustomNavLink
								to={href('/about')}
								className={({ isActive, isPending }) =>
									isPending ? 'text-green-500' : isActive ? 'underline' : ''
								}
							>
								About
							</CustomNavLink>
						</li>

						{hasToken && (
							<li>
								<CustomNavLink
									to={href('/host')}
									className={({ isActive, isPending }) =>
										isPending ? 'text-green-500' : isActive ? 'underline' : ''
									}
								>
									Host
								</CustomNavLink>
							</li>
						)}
						<li>
							<CustomNavLink
								to={href('/vans')}
								className={({ isActive, isPending }) =>
									isPending ? 'text-green-500' : isActive ? 'underline' : ''
								}
							>
								Vans
							</CustomNavLink>
						</li>

						{!hasToken ? (
							<li>
								<CustomNavLink
									to={href('/login')}
									className={({ isActive, isPending }) =>
										isPending ? 'text-green-500' : isActive ? 'underline' : ''
									}
								>
									Login
								</CustomNavLink>
							</li>
						) : (
							<li>
								<CustomLink to={href('/signout')}>Sign out</CustomLink>
							</li>
						)}
					</ul>
				</nav>
			</header>
			<main className="mb-6 grid grid-rows-subgrid">
				<Outlet />
			</main>
			<footer className="-px-2 sm:-px-6 w-full bg-neutral-800 py-6.25">
				<p className="text-center text-gray-400 text-sm uppercase">
					&copy;{new Date().getFullYear()} #vanlife
				</p>
				<a
					href="https://www.flaticon.com/free-icons/camper-van"
					title="camper van icons"
					className="inline-block w-full text-center text-gray-400 text-sm"
				>
					Camper van icons created by Iconfromus - Flaticon
				</a>
				<a
					href="https://www.flaticon.com/free-icons/image-placeholder"
					title="image placeholder icons"
					className="inline-block w-full text-center text-gray-400 text-sm"
				>
					Image placeholder icons created by Graphics Plazza - Flaticon
				</a>
			</footer>
		</>
	);
}
