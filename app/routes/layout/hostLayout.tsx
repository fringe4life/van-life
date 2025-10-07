import {
	ArrowRightLeft,
	Car,
	KeySquare,
	LayoutDashboard,
	SquarePlus,
	Star,
	Wallet,
} from 'lucide-react';
import { href, Outlet } from 'react-router';
import GenericComponent from '~/components/generic-component';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomNavLink from '~/features/navigation/components/custom-nav-link';
import navLinkClassName from '~/features/navigation/utils/nav-link-class-name';
import type { Route } from './+types/hostLayout';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

const hostNavItems = [
	{
		to: href('/host'),
		title: 'Dashboard',
		children: (
			<>
				<LayoutDashboard className="aspect-square" />
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
				<Wallet className="aspect-square" />
				<span>Income</span>
			</>
		),
	},
	{
		to: href('/host/transfers'),
		title: 'Transfers',
		children: (
			<>
				<ArrowRightLeft className="aspect-square" />
				<span>Transfers</span>
			</>
		),
	},
	{
		to: href('/host/vans'),
		title: 'Vans',
		children: (
			<>
				<Car className="aspect-square" />
				<span>Vans</span>
			</>
		),
	},
	{
		to: href('/host/review'),
		title: 'Reviews',
		children: (
			<>
				<Star className="aspect-square" />
				<span>Reviews</span>
			</>
		),
	},
	{
		to: href('/host/add'),
		title: 'Add Van',
		children: (
			<>
				<SquarePlus className="aspect-square" />
				<span>Add Van</span>
			</>
		),
	},
	{
		to: href('/host/rentals'),
		title: 'Rentals',
		children: (
			<>
				<KeySquare className="aspect-square" />
				<span>Rentals</span>
			</>
		),
	},
];

export default function HostLayout() {
	return (
		<>
			<div className="max-w-[var(--host-layout-max-width)] contain-content">
				<GenericComponent
					as="ul"
					Component={CustomNavLink}
					className="mask-r-from-95% no-scrollbar mb-5 grid auto-cols-max grid-flow-col grid-rows-1 items-center gap-3 overflow-x-auto overscroll-x-contain py-3 contain-content"
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
				/>
			</div>
			<Outlet />
		</>
	);
}
