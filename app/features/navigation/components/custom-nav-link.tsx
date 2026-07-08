import { NavLink, type NavLinkProps } from 'react-router';
import useIsPage from '~/hooks/use-is-page';
export type CustomNavLinkProps = Omit<NavLinkProps, 'style'>;

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
