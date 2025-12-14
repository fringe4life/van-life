import type { Direction } from '~/features/pagination/types';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_FILTER = '';
export const DEFAULT_CURSOR = '';
export const DEFAULT_DIRECTION = 'forward';
export const DEFAULT_SORT = 'newest';

export const LIMITS = [5, 10, 20, 50] as const;
export const DIRECTIONS = ['forward', 'backward'] satisfies Direction[];
export const SORT_OPTIONS = ['newest', 'oldest', 'highest', 'lowest'] as const;

export const NO_PAGINATION = {
	items: null,
	hasNextPage: false,
	hasPreviousPage: false,
} as const;
