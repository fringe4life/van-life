import { createLoader, createStandardSchemaV1 } from 'nuqs/server';
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

// Create Standard Schema validators for external validation (e.g., tRPC)
export const validatePaginationParams =
	createStandardSchemaV1(paginationParsers);
export const validateHostSearchParams = createStandardSchemaV1(
	hostPaginationParsers
);
export const validateSearchParams = createStandardSchemaV1(searchParser);
export const validateVanFiltersParams =
	createStandardSchemaV1(vanFiltersParser);
