import {
	ArrowRightLeft,
	BanknoteArrowUp,
	Car,
	KeySquare,
	LayoutDashboard,
	SquarePlus,
	Star,
	Wallet,
} from 'lucide-react';
import { href, Outlet } from 'react-router';
import GenericComponent from '~/components/common/GenericComponent';
import CustomNavLink from '~/components/navigation/CustomNavLink';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import navLinkClassName from '~/utils/navLinkClassName';
import type { Route } from './+types/hostLayout';

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
	await getSessionOrRedirect(request);
};

const hostNavItems = [
	{
		to: href('/host'),
		title: 'Dashboard',
		children: (
			<>
				<LayoutDashboard className="aspect-square w-10" />
				<span>Dashboard</span>
			</>
		),
		end: true,
	},
	{
		to: href('/host/income'),
		title: 'Income',
		children: (
			<>
				<Wallet className="aspect-square w-10" />
				<span>Income</span>
			</>
		),
	},
	{
		to: href('/host/transfers'),
		title: 'Transfers',
		children: (
			<>
				<ArrowRightLeft className="aspect-square w-10" />
				<span>Transfers</span>
			</>
		),
	},
	{
		to: href('/host/vans'),
		title: 'Vans',
		children: (
			<>
				<Car className="aspect-square w-10" />
				<span>Vans</span>
			</>
		),
	},
	{
		to: href('/host/review'),
		title: 'Reviews',
		children: (
			<>
				<Star className="aspect-square w-10" />
				<span>Reviews</span>
			</>
		),
	},
	{
		to: href('/host/add'),
		title: 'Add Van',
		children: (
			<>
				<SquarePlus className="aspect-square w-10" />
				<span>Add Van</span>
			</>
		),
	},
	{
		to: href('/host/money'),
		title: 'Add Money',
		children: (
			<>
				<BanknoteArrowUp className="aspect-square w-10" />
				<span>Add Money</span>
			</>
		),
	},
	{
		to: href('/host/rentals'),
		title: 'Rentals',
		children: (
			<>
				<KeySquare className="aspect-square w-10" />
				<span>Rentals</span>
			</>
		),
	},
];

export default function HostLayout() {
	return (
		<div className="mx-auto max-w-[calc(100dvw_-_1.75rem)] contain-content sm:mx-0">
			<GenericComponent
				as="ul"
				Component={CustomNavLink}
				className="mask-r-from-90% sm:mask-none no-scrollbar mb-5 grid auto-cols-max grid-flow-col grid-rows-1 items-center gap-3 overflow-x-auto overscroll-x-contain py-3 contain-content sm:gap-3"
				emptyStateMessage="No nav links"
				items={hostNavItems}
				renderKey={(item) => item.to}
				renderProps={(item) => ({
					to: item.to,
					title: item.title,
					...(item.end ? { end: true } : {}),
					className: navLinkClassName,
					children: item.children,
				})}
				wrapperProps={{}}
			/>
			<Outlet />
		</div>
	);
}
