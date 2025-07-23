import { href, Outlet } from 'react-router';
import CustomNavLink from '~/components/CustomNavLink';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import type { Route } from './+types/hostLayout';

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
	await getSessionOrRedirect(request);
};

export default function HostLayout() {
	return (
		<div className="max-w-[calc(100dvw_-_2rem)]">
			<ul className="mask-r-from-85% no-scrollbar flex h-[3lh] max-w-full gap-3 overflow-x-auto pr-4 pb-10">
				<li>
					<CustomNavLink
						to={href('/host')}
						end
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Dashboard
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/income')}
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Income
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/vans')}
						end
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Vans
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/review')}
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Reviews
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/add')}
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Add Van
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/money')}
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Add Money
					</CustomNavLink>
				</li>
				<li>
					<CustomNavLink
						to={href('/host/rentals')}
						className={({ isActive, isPending }) =>
							isPending ? 'text-green-500' : isActive ? 'underline' : ''
						}
					>
						Rentals
					</CustomNavLink>
				</li>
			</ul>
			<Outlet />
		</div>
	);
}
