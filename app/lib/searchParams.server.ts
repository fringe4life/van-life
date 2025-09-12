import { createLoader, createStandardSchemaV1 } from 'nuqs/server';
import { hostPaginationParsers, paginationParsers } from '~/lib/parsers';

// Create loaders for React Router v7
export const loadSearchParams = createLoader(paginationParsers);
export const loadHostSearchParams = createLoader(hostPaginationParsers);

// Create Standard Schema validators for external validation (e.g., tRPC)
export const validateSearchParams = createStandardSchemaV1(paginationParsers);
export const validateHostSearchParams = createStandardSchemaV1(
	hostPaginationParsers
);
