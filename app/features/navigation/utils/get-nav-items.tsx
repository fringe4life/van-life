import { Info, LogIn, LogOut, Truck, User } from 'lucide-react';
import { href } from 'react-router';
import type { NavItem } from '../types';
import { linkClassName } from './link-class-name';
import { navLinkClassName } from './nav-link-class-name';

export function getNavItems(hasToken: boolean): NavItem[] {
	const items = [
		{
			children: (
				<>
					<Info className="aspect-square" />
					<span>About</span>
				</>
			),
			id: 'about',
			props: { className: navLinkClassName, to: href('/about') },
			show: true,
			type: 'nav-link',
		},
		{
			children: (
				<>
					<User className="aspect-square" />
					<span>Host</span>
				</>
			),
			id: 'host',
			props: { className: navLinkClassName, to: href('/host') },
			show: hasToken,
			type: 'nav-link',
		},
		{
			children: (
				<>
					<Truck className="aspect-square" />
					<span>Vans</span>
				</>
			),
			id: 'vans',
			props: { className: navLinkClassName, to: href('/vans') },
			show: true,
			type: 'nav-link',
		},
		{
			children: (
				<>
					<LogIn className="aspect-square" />
					<span>Login</span>
				</>
			),
			id: 'login',
			props: { className: navLinkClassName, to: href('/login') },
			show: !hasToken,
			type: 'nav-link',
		},
		{
			children: (
				<>
					<LogOut className="aspect-square" />
					<span>Sign out</span>
				</>
			),
			id: 'signout',
			props: { className: linkClassName, to: href('/signout') },
			show: !!hasToken,
			type: 'link',
		},
	] satisfies NavItem[];

	return items.filter((item) => item.show);
}
