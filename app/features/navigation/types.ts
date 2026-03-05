import type { ReactElement, ReactNode } from 'react';
import type { LinkProps, NavLinkProps } from 'react-router';
import type { Maybe } from '~/types';

export type CustomLinkProps = Omit<LinkProps, 'style'>;
export type CustomNavLinkProps = Omit<NavLinkProps, 'style'>;

export interface NavProps {
	hasToken: boolean;
}

export interface UseSheetDialogParams {
	className?: string;
	container?: Maybe<HTMLElement>;
	modal?: boolean;
	renderContent: (close: () => void) => ReactNode;
	title: string;
	trigger: ReactElement | ((isOpen: boolean) => ReactElement);
}
