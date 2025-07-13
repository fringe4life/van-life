import { useEffect } from 'react';
import { href, Outlet } from 'react-router';
import CustomLink from '~/components/CustomLink';
import CustomNavLink from '~/components/CustomNavLink';
import { authClient } from '~/lib/auth/client';

export default function Layout() {
	const { data: session } = authClient.useSession();
	let hasToken = session?.session !== undefined;
	useEffect(() => {
		hasToken = session?.session !== undefined;
		console.log({ hasToken });
	}, [session?.session, hasToken]);
	return (
		<>
			<header className="flex items-center justify-between gap-6 px-4 py-9">
				<h1 className="font-black text-2xl uppercase">
					<CustomLink to={href('/')}>#vanlife</CustomLink>
				</h1>
				<nav>
					<ul className="flex flex-wrap gap-3 sm:flex-nowrap">
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
			<footer className="bg-neutral-800 py-6.25">
				<p className="text-center text-[#aaa] text-sm uppercase">
					&copy;{new Date().getFullYear()} #vanlife
				</p>
				<a
					href="https://www.flaticon.com/free-icons/camper-van"
					title="camper van icons"
					className="inline-block w-full text-center text-[#aaa] text-sm"
				>
					Camper van icons created by Iconfromus - Flaticon
				</a>
			</footer>
		</>
	);
}
// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=13335'>Iconpacks</a>

// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=13375'>Iconpacks</a>

// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=16709'>Iconpacks</a>

// <a target="_blank" href="https://www.vexels.com/png-svg/preview/199192/rv-trailer-illustration">www.vexels.com</a>
