import { NavLink, type NavLinkProps } from 'react-router';

export default function CustomNavLink({ children, to, ...rest }: NavLinkProps) {
	const isPage = location.pathname === to;
	return (
		<NavLink
			to={to}
            prefetch='viewport'
			{...rest}
			style={{ pointerEvents: isPage ? 'none' : 'auto' }}
			viewTransition
		>
			{children}
		</NavLink>
	);
}
