import {
	ArrowRightLeft,
	Car,
	KeySquare,
	LayoutDashboard,
	SquarePlus,
	Star,
	Wallet,
} from 'lucide-react';
import { href } from 'react-router';

const hostNavItems = [
	{
		to: href('/host'),
		id: 'Dashboard',
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
		id: 'Income',
		children: (
			<>
				<Wallet className="aspect-square" />
				<span>Income</span>
			</>
		),
	},
	{
		to: href('/host/transfers'),
		id: 'Transfers',
		children: (
			<>
				<ArrowRightLeft className="aspect-square" />
				<span>Transfers</span>
			</>
		),
	},
	{
		to: href('/host/vans'),
		id: 'Vans',
		children: (
			<>
				<Car className="aspect-square" />
				<span>Vans</span>
			</>
		),
	},
	{
		to: href('/host/review'),
		id: 'Reviews',
		children: (
			<>
				<Star className="aspect-square" />
				<span>Reviews</span>
			</>
		),
	},
	{
		to: href('/host/vans'),
		id: 'Add Van',
		children: (
			<>
				<SquarePlus className="aspect-square" />
				<span>Add Van</span>
			</>
		),
	},
	{
		to: href('/host/rentals'),
		id: 'Rentals',
		children: (
			<>
				<KeySquare className="aspect-square" />
				<span>Rentals</span>
			</>
		),
	},
];

export { hostNavItems };
