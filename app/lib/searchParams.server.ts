import { createSearchParamsCache } from 'nuqs/server';
import { hostPaginationParsers, paginationParsers } from './parsers';

// Create a server-side cache for search parameters
export const searchParamsCache = createSearchParamsCache(paginationParsers);

// Create a server-side cache for host routes (page and limit only)
export const hostSearchParamsCache = createSearchParamsCache(
	hostPaginationParsers,
);
