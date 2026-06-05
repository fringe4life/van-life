import type { ReactNode } from 'react';
import type { LinkProps, NavLinkProps } from 'react-router';

export type CustomLinkProps = Omit<LinkProps, 'style'>;
export type CustomNavLinkProps = Omit<NavLinkProps, 'style'>;

export interface NavProps {
	hasToken: boolean;
}

export interface MobileNavProps {
	items: NavItem[];
}

interface BaseNavItem {
	children: ReactNode;
	id: string;
	show: boolean;
}

export type NavLinkItem = BaseNavItem & {
	type: 'nav-link';
	props: CustomNavLinkProps;
};

export type LinkItem = BaseNavItem & {
	type: 'link';
	props: CustomLinkProps;
};

export type NavItem = NavLinkItem | LinkItem;
