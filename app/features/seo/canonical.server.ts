import { createSerializer } from 'nuqs/server';
import { href } from 'react-router';
import {
	paginationParsers,
	searchParser,
	vanFiltersParser,
} from '~/lib/parsers';
import type { LowercaseVanType } from '../vans/types';
import { getSiteOrigin } from './get-site-origin.server';

const canonicalVanListParsers = {
	...searchParser,
	...vanFiltersParser,
	type: paginationParsers.type,
	vanFilter: paginationParsers.vanFilter,
};

const serializeCanonicalVanListParams = createSerializer(
	canonicalVanListParsers,
	{
		processUrlSearchParams: (searchParams) => {
			searchParams.sort();
			return searchParams;
		},
	}
);

interface VanListCanonicalParams {
	excludeInRepair: boolean;
	onlyOnSale: boolean;
	search: string;
	type: LowercaseVanType | '';
	types: LowercaseVanType[];
	vanFilter: '' | 'new' | 'sale';
}

export const buildVanListCanonicalUrl = (
	request: Request,
	params: VanListCanonicalParams
): string => {
	const origin = getSiteOrigin(request);
	const queryString = serializeCanonicalVanListParams({
		excludeInRepair: params.excludeInRepair,
		onlyOnSale: params.onlyOnSale,
		search: params.search,
		type: params.type,
		types: params.types,
		vanFilter: params.vanFilter,
	});

	return queryString
		? `${origin}${href('/vans')}${queryString}`
		: `${origin}${href('/vans')}`;
};

export const buildVanDetailCanonicalUrl = (
	request: Request,
	vanSlug: string
): string => {
	const origin = getSiteOrigin(request);
	return `${origin}${href('/vans/:vanSlug', { vanSlug })}`;
};

export const buildPathCanonicalUrl = (
	request: Request,
	path: '/' | '/about'
): string => {
	const origin = getSiteOrigin(request);
	return `${origin}${path === '/' ? href('/') : href('/about')}`;
};
