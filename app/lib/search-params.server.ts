import { createLoader, createStandardSchemaV1 } from 'nuqs/server';
import {
	hostPaginationParsers,
	paginationParsers,
	searchParser,
} from '~/lib/parsers';

// Create loaders for React Router v7
export const loadPaginationParams = createLoader(paginationParsers);
export const loadHostSearchParams = createLoader(hostPaginationParsers);
export const loadSearchParams = createLoader(searchParser);

// Create Standard Schema validators for external validation (e.g., tRPC)
export const validatePaginationParams =
	createStandardSchemaV1(paginationParsers);
export const validateHostSearchParams = createStandardSchemaV1(
	hostPaginationParsers
);
export const validateSearchParams = createStandardSchemaV1(searchParser);
