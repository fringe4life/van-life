import type { Prisma } from '~/generated/prisma/client';
import type { Id, List, Maybe, Prettify } from '~/types';
import type { UUIDv7 } from '~/types/ids.server';

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

export type PaginationProps<T> = Prettify<
	Items<T> & {
		paginationMetadata: PaginationMetadata;
	}
>;

export interface CursorMetadata {
	actualCursor: Exclude<Maybe<Id>, null>;
	orderBy: { id: Prisma.SortOrder };
	skip: number;
	take: number;
}

export interface BasePaginationParams {
	cursor: Maybe<UUIDv7>;
	direction?: Direction;
	limit: number;
}

export type ToPaginationParams<T> = Prettify<Items<T> & BasePaginationParams>;

export type PaginationParams = Prettify<
	BasePaginationParams & {
		sort?: SortOption;
		userId: UUIDv7;
	}
>;
