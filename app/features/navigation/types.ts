import type { LinkProps, NavLinkProps } from 'react-router';

export type CustomLinkProps = Omit<LinkProps, 'style'>;
export type CustomNavLinkProps = Omit<NavLinkProps, 'style'>;

export interface NavProps {
	hasToken: boolean;
}
