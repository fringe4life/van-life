import { NavLink, type NavLinkProps } from 'react-router';
import useIsPage from '~/hooks/use-is-page';

export default function CustomNavLink({
	children,
	to,
	...rest
}: Omit<NavLinkProps, 'style'>) {
	const { isPage } = useIsPage({ to });
	return (
		<NavLink
			to={to}
			{...rest}
			prefetch="intent"
			style={{ pointerEvents: isPage ? 'none' : 'auto' }}
			viewTransition
		>
			{children}
		</NavLink>
	);
}
