import type { Prisma } from '~/generated/prisma/client';
import type { List, Maybe } from '~/types/types';

// Type for pagination direction
export type Direction = 'forward' | 'backward';

// Type for review sorting options
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface PaginationProps<T> {
	items: List<T>;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface CursorPaginationInformation {
	actualCursor: Maybe<string>;
	sortOrder: Prisma.SortOrder;
	takeAmount: number;
}

export interface PaginationParams {
	userId: string;
	cursor: Maybe<string>;
	limit: number;
	direction?: Direction;
	sort?: SortOption;
}
