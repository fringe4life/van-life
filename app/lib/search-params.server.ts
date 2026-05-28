import { createLoader } from 'nuqs/server';
import {
	hostPaginationParsers,
	paginationParsers,
	searchParser,
	vanFiltersParser,
} from '~/lib/parsers';

// Create loaders for React Router v7
export const loadPaginationParams = createLoader(paginationParsers);
export const loadHostSearchParams = createLoader(hostPaginationParsers);
export const loadSearchParams = createLoader(searchParser);
export const loadVanFiltersParams = createLoader(vanFiltersParser);
