import { ABOUT_IMG } from '~/features/image/img-constants';
import {
	loadPaginationParams,
	loadSearchParams,
	loadVanFiltersParams,
} from '~/lib/search-params.server';
import {
	buildPathCanonicalUrl,
	buildVanDetailCanonicalUrl,
	buildVanListCanonicalUrl,
} from './canonical.server';
import {
	ABOUT_DESCRIPTION,
	DEFAULT_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	VANS_DESCRIPTION,
} from './constants';
import type { PageSeo } from './types';

export const buildHomePageSeo = (request: Request): PageSeo => ({
	title: 'Home | Van Life',
	description: DEFAULT_DESCRIPTION,
	url: buildPathCanonicalUrl(request, '/'),
	image: DEFAULT_OG_IMAGE,
});

export const buildAboutPageSeo = (request: Request): PageSeo => ({
	title: 'About | Van Life',
	description: ABOUT_DESCRIPTION,
	url: buildPathCanonicalUrl(request, '/about'),
	image: ABOUT_IMG,
});

export const buildVansPageSeo = (request: Request): PageSeo => {
	const { search } = loadSearchParams(request);
	const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);
	const { type, vanFilter } = loadPaginationParams(request);

	return {
		title: 'Vans | Van Life',
		description: VANS_DESCRIPTION,
		url: buildVanListCanonicalUrl(request, {
			search,
			types,
			excludeInRepair,
			onlyOnSale,
			type,
			vanFilter,
		}),
		image: DEFAULT_OG_IMAGE,
	};
};

export const buildVanDetailPageSeo = (
	request: Request,
	van: { name: string; description: string; imageUrl: string; slug: string }
): PageSeo => ({
	title: `${van.name} | Van Life`,
	description: `${van.name} - ${van.description}`,
	url: buildVanDetailCanonicalUrl(request, van.slug),
	image: van.imageUrl,
});
