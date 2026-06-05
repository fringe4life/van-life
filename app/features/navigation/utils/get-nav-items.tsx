import { Info, LogIn, LogOut, Truck, User } from 'lucide-react';
import { href } from 'react-router';
import type { NavItem } from '../types';
import { linkClassName } from './link-class-name';
import { navLinkClassName } from './nav-link-class-name';

export function getNavItems(hasToken: boolean): NavItem[] {
	const items = [
		{
			type: 'nav-link',
			props: { to: href('/about'), className: navLinkClassName },
			children: (
				<>
					<Info className="aspect-square" />
					<span>About</span>
				</>
			),
			id: 'about',
			show: true,
		},
		{
			type: 'nav-link',
			props: { to: href('/host'), className: navLinkClassName },
			children: (
				<>
					<User className="aspect-square" />
					<span>Host</span>
				</>
			),
			id: 'host',
			show: hasToken,
		},
		{
			type: 'nav-link',
			props: { to: href('/vans'), className: navLinkClassName },
			children: (
				<>
					<Truck className="aspect-square" />
					<span>Vans</span>
				</>
			),
			id: 'vans',
			show: true,
		},
		{
			type: 'nav-link',
			props: { to: href('/login'), className: navLinkClassName },
			children: (
				<>
					<LogIn className="aspect-square" />
					<span>Login</span>
				</>
			),
			id: 'login',
			show: !hasToken,
		},
		{
			type: 'link',
			props: { to: href('/signout'), className: linkClassName },
			children: (
				<>
					<LogOut className="aspect-square" />
					<span>Sign out</span>
				</>
			),
			id: 'signout',
			show: !!hasToken,
		},
	] satisfies NavItem[];

	return items.filter((item) => item.show);
}
