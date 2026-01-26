import Info from 'lucide-react/dist/esm/icons/info';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Truck from 'lucide-react/dist/esm/icons/truck';
import User from 'lucide-react/dist/esm/icons/user';
import { href } from 'react-router';
import { CustomLink } from '../components/custom-link';
import { CustomNavLink } from '../components/custom-nav-link';
import { linkClassName } from './link-class-name';
import { navLinkClassName } from './nav-link-class-name';

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
			id: 'about',
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
			id: 'host',
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
			id: 'vans',
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
			id: 'login',
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
			id: 'signout',
			show: !!hasToken,
		},
	].filter((item) => item.show);
}
