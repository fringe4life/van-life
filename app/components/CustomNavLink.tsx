import { NavLink, type NavLinkProps, useLocation } from 'react-router';

export default function CustomNavLink({
	children,
	to,
	...rest
}: Omit<NavLinkProps, 'style'>) {
	const location = useLocation();
	const isPath = location.pathname === to;
	const isSearch = to.search === location.search;
	const isPage = isSearch && isPath;
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
