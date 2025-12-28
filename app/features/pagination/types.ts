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

export interface PaginationProps<T> {
	items: List<T>;
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

export interface PaginationParams extends BasePaginationParams {
	userId: string;
	sort?: SortOption;
}
