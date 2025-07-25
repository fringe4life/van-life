import type { ReactNode } from 'react';
import type CustomLink from './CustomLink';
import type CustomNavLink from './CustomNavLink';

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

function isCustomNavLink(
	component: NavItemComponent,
): component is typeof CustomNavLink {
	return component.name === 'CustomNavLink';
}

function NavItem({ Component, props, children }: NavItemProps) {
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
	} else {
		// className must be string
		return (
			<li>
				<Component {...(props as React.ComponentProps<typeof CustomLink>)}>
					{children}
				</Component>
			</li>
		);
	}
}

export default NavItem;
