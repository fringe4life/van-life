import { NavLink, type NavLinkProps } from 'react-router';
import useIsPage from '~/hooks/useIsPage';

export default function CustomNavLink({
	children,
	to,
	...rest
}: Omit<NavLinkProps, 'style'>) {
	const { isPage } = useIsPage({ to });
	return (
		<NavLink
			to={to}
			prefetch="none"
			{...rest}
			style={{ pointerEvents: isPage ? 'none' : 'auto' }}
			viewTransition
		>
			{children}
		</NavLink>
	);
}
