import type { ComponentProps, ReactNode } from 'react';
import { CustomLink } from '../components/custom-link';
import { CustomNavLink } from '../components/custom-nav-link';
import { linkClassName } from './link-class-name';

export interface NavItemType {
	Component: typeof CustomNavLink | typeof CustomLink;
	props:
		| ComponentProps<typeof CustomNavLink>
		| ComponentProps<typeof CustomLink>;
	children: ReactNode;
	key: string;
	show: boolean;
}

export const createMobileNavItem =
	(handleNavLinkClick: () => void) =>
	(item: NavItemType): NavItemType => {
		if (item.Component === CustomNavLink) {
			return {
				...item,
				props: {
					...item.props,
					onClick: handleNavLinkClick,
				},
			};
		}

		const { className, ...rest } = item.props as ComponentProps<
			typeof CustomLink
		>;
		return {
			...item,
			props: {
				...rest,
				onClick: handleNavLinkClick,
				...(typeof className === 'string'
					? { className }
					: { className: linkClassName }),
			},
			Component: CustomLink,
		};
	};

export const toMobileNavItems = (
	items: NavItemType[],
	handleNavLinkClick: () => void
): NavItemType[] => items.map(createMobileNavItem(handleNavLinkClick));
