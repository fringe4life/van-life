import { Info, LogIn, LogOut, Truck, User } from 'lucide-react';
import { href } from 'react-router';
import CustomLink from '../components/CustomLink';
import CustomNavLink from '../components/CustomNavLink';
import { linkClassName } from './linkClassName';
import navLinkClassName from './navLinkClassName';

export function getNavItems(hasToken: boolean) {
	return [
		{
			Component: CustomNavLink,
			props: { to: href('/about'), className: navLinkClassName },
			children: (
				<>
					<Info className="aspect-square" />
					<span>About</span>
				</>
			),
			key: 'about',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/host'), className: navLinkClassName },
			children: (
				<>
					<User className="aspect-square" />
					<span>Host</span>
				</>
			),
			key: 'host',
			show: hasToken,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/vans'), className: navLinkClassName },
			children: (
				<>
					<Truck className="aspect-square" />
					<span>Vans</span>
				</>
			),
			key: 'vans',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/login'), className: navLinkClassName },
			children: (
				<>
					<LogIn className="aspect-square" />
					<span>Login</span>
				</>
			),
			key: 'login',
			show: !hasToken,
		},
		{
			Component: CustomLink,
			props: { to: href('/signout'), className: linkClassName },
			children: (
				<>
					<LogOut className="aspect-square" />
					<span>Sign out</span>
				</>
			),
			key: 'signout',
			show: !!hasToken,
		},
	].filter((item) => item.show);
}
