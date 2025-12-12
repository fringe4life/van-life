import type { Prisma } from '~/generated/prisma/client';
import type { Maybe } from '~/types/types';

// Type for pagination direction
export type Direction = 'forward' | 'backward';

// Type for review sorting options
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export type PaginationProps<T = unknown> = {
	items: Maybe<T[]>;
	limit: number;
	cursor: Maybe<string>;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	pathname: string;
};

export type CursorPaginationInformation = {
	actualCursor: Maybe<string>;
	sortOrder: Prisma.SortOrder;
	takeAmount: number;
};

export type PaginationParams = {
	userId: string;
	cursor: Maybe<string>;
	limit: number;
	direction?: Direction;
	sort?: SortOption;
};
