import { createLoader } from 'nuqs/server';
import { hostPaginationParsers, paginationParsers } from '~/lib/parsers';

// Create loaders for React Router v7
export const loadSearchParams = createLoader(paginationParsers);
export const loadHostSearchParams = createLoader(hostPaginationParsers);
