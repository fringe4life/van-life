import type { Prisma } from '~/generated/prisma/client';
import type { Id, List, Maybe } from '~/types/types';

// Type for pagination direction
export type Direction = 'forward' | 'backward';

// Type for review sorting options
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface PaginationMetadata {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface Items<T> {
	items: List<T>;
}

export interface PaginationProps<T> extends Items<T> {
	paginationMetadata: PaginationMetadata;
}

export interface CursorMetadata {
	actualCursor: Exclude<Maybe<Id>, null>;
	sortOrder: Prisma.SortOrder;
	take: number;
	skip: number;
}

export interface BasePaginationParams {
	cursor: Maybe<string>;
	limit: number;
	direction?: Direction;
}

export interface ToPaginationParams<T> extends Items<T>, BasePaginationParams {}

export interface PaginationParams extends BasePaginationParams {
	userId: string;
	sort?: SortOption;
}
