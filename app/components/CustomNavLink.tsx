import { NavLink, type NavLinkProps, useLocation } from 'react-router';

export default function CustomNavLink({
	children,
	to,
	...rest
}: Omit<NavLinkProps, 'style'>) {
	const location = useLocation();
	const isPage = location.pathname === to;
	return (
		<NavLink
			to={to}
			prefetch="viewport"
			{...rest}
			style={{ pointerEvents: isPage ? 'none' : 'auto' }}
			viewTransition
		>
			{children}
		</NavLink>
	);
}
