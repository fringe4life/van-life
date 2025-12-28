import type { ReactElement, ReactNode } from 'react';
import type { LinkProps, NavLinkProps } from 'react-router';
import type { Maybe } from '~/types/types';

export type CustomLinkProps = Omit<LinkProps, 'style'>;
export type CustomNavLinkProps = Omit<NavLinkProps, 'style'>;

export interface NavProps {
	hasToken: boolean;
}

export interface UseSheetDialogParams {
	trigger: ReactElement | ((isOpen: boolean) => ReactElement);
	renderContent: (close: () => void) => ReactNode;
	className?: string;
	modal?: boolean;
	container?: Maybe<HTMLElement>;
	title: string;
}
