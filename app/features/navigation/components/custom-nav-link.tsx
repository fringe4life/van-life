import { NavLink } from 'react-router';
import useIsPage from '~/hooks/use-is-page';
import type { CustomNavLinkProps } from '../types';

const CustomNavLink = ({ children, to, ...rest }: CustomNavLinkProps) => {
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
};

export { CustomNavLink };
