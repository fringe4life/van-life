import type { ReactNode } from 'react';
import type { CustomLink } from './custom-link';
import type { CustomNavLink } from './custom-nav-link';

// HOC type for NavItem
export type NavItemComponent = typeof CustomLink | typeof CustomNavLink;
export type NavItemComponentProps =
	| React.ComponentProps<typeof CustomLink>
	| React.ComponentProps<typeof CustomNavLink>;

export interface NavItemProps {
	Component: NavItemComponent;
	props: NavItemComponentProps;
	children?: ReactNode;
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
				<Component {...(props as React.ComponentProps<typeof CustomNavLink>)}>
					{children}
				</Component>
			</li>
		);
	}
	// className must be string
	return (
		<li>
			<Component {...(props as React.ComponentProps<typeof CustomLink>)}>
				{children}
			</Component>
		</li>
	);
};

export { NavItem };
