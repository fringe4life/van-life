import type { ReactNode } from 'react';
import type { CustomLink } from './custom-link';
import type { CustomNavLink } from './custom-nav-link';

// HOC type for NavItem
type NavItemComponent = typeof CustomLink | typeof CustomNavLink;
type NavItemComponentProps =
	| React.ComponentProps<typeof CustomLink>
	| React.ComponentProps<typeof CustomNavLink>;

interface NavItemProps {
	Component: NavItemComponent;
	children?: ReactNode;
	props: NavItemComponentProps;
}

const isCustomNavLink = (
	component: NavItemComponent
): component is typeof CustomNavLink => component.name === 'CustomNavLink';

const NavItem = ({ Component, props, children }: NavItemProps) => {
	// Type guard for CustomNavLink vs CustomLink
	if (isCustomNavLink(Component)) {
		// className can be string or function
		return (
			<li>
				<Component {...props}>{children}</Component>
			</li>
		);
	}
	// className must be string
	const { className, ...rest } = props;
	return (
		<li>
			<Component
				{...rest}
				className={typeof className === 'string' ? className : undefined}
			>
				{children}
			</Component>
		</li>
	);
};

export { NavItem };
