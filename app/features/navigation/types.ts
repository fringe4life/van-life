import type { ReactNode } from 'react';
import type { LinkProps, NavLinkProps } from 'react-router';
import type { Prettify } from '~/types';

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

type NavLinkItem = Prettify<
	BaseNavItem & {
		type: 'nav-link';
		props: CustomNavLinkProps;
	}
>;

type LinkItem = Prettify<
	BaseNavItem & {
		type: 'link';
		props: CustomLinkProps;
	}
>;

export type NavItem = NavLinkItem | LinkItem;
