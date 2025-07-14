import { href, Outlet } from 'react-router';
import CustomNavLink from '~/components/CustomNavLink';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import type { Route } from './+types/hostLayout';

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
	await getSessionOrRedirect(request);
};

export default function HostLayout() {
	return (
		<div>
			<ul className=" mb-14 flex flex-wrap gap-3">
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
