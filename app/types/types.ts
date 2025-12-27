import type { ComponentProps, ElementType } from 'react';

// Type for Maybe
export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

export type MaybeError<T> = T | string;

export interface Id {
	id: string;
}

export interface EmptyState {
	emptyStateMessage: string;
}

export interface ErrorState {
	errorStateMessage: string;
}

export interface GenericComponentProps<
	T,
	P,
	E extends React.ElementType = 'div',
> extends EmptyState,
		ErrorState {
	Component: React.ComponentType<P>;
	items: List<T>;
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
	as?: E;
	wrapperProps?: React.ComponentPropsWithoutRef<E>;
}

export interface ListItemProps<T> {
	items: T[];
	getKey: (t: T) => React.Key;
	getRow: (t: T) => React.ReactNode;
}

export type PendingUiProps<T extends ElementType = 'div'> = {
	/** The HTML element to render (default: 'div') */
	as?: T;
	/** Additional CSS classes to merge with pending UI classes */
	className?: string;
	/** Whether to show pending UI (defaults to useIsNavigating hook) */
	isPending?: boolean;
	/** Custom opacity value when pending (default: 0.75) */
	pendingOpacity?: number;
	/** Children to render */
	children: React.ReactNode;
} & Omit<ComponentProps<T>, 'as' | 'className' | 'children'>;

interface Success<T> {
	data: T;
	error: null;
}
interface Failure<E> {
	data: null;
	error: E;
}

export type Result<T, E> = Success<T> | Failure<E>;

export interface SortableProps {
	/** Title to display above the sort buttons */
	title: string;
	/** Number of items being sorted (for display) */
	itemCount: Maybe<number>;
	/** Optional className for the container */
	className?: string;
}

export interface UnsuccesfulStateProps {
	message: string;
	isError?: boolean;
}
