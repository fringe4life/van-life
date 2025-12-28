import type { ElementType } from 'react';
import type { Items } from '~/features/pagination/types';
import type { VanModel } from '~/generated/prisma/models';

// Type for Maybe
export type Maybe<T> = T | null | undefined;

export type List<T> = Maybe<T[]>;

export interface Id extends Pick<VanModel, 'id'> {}

export interface EmptyState {
	emptyStateMessage: string;
}

export interface ErrorState {
	errorStateMessage: string;
}

export interface AsProps<T extends ElementType = 'div'> {
	as?: T;
}

export interface GenericComponentProps<
	T,
	P,
	E extends React.ElementType = 'div',
> extends EmptyState,
		ErrorState,
		Items<T>,
		AsProps<E> {
	Component: React.ComponentType<P>;
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
	wrapperProps?: React.ComponentPropsWithoutRef<E>;
}

export interface ListItemProps<T> {
	items: T[];
	getKey: (t: T) => React.Key;
	getRow: (t: T) => React.ReactNode;
}

export interface PendingUIProps<T extends ElementType = 'div'>
	extends AsProps<T> {
	/** The HTML element to render (default: 'div') */
	/** Additional CSS classes to merge with pending UI classes */
	className?: string;
	/** Whether to show pending UI (defaults to useIsNavigating hook) */
	isPending?: boolean;
	/** Custom opacity value when pending (default: 0.75) */
	pendingOpacity?: number;
	/** Children to render */
	children: React.ReactNode;
}

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
