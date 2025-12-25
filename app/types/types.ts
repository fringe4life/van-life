// Type for Maybe
export type Maybe<T> = T | null | undefined;

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
