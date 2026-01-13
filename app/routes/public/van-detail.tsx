import { data, href, isRouteErrorResponse } from 'react-router';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import VanDetail from '~/features/vans/components/van-detail';
import { getVanBySlug } from '~/features/vans/queries/queries';
import {
	loadPaginationParams,
	loadSearchParams,
	loadVanFiltersParams,
} from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/van-detail';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	// Parse search parameters from URL to preserve pagination and filter state
	const { cursor, limit } = loadPaginationParams(request);
	const { search } = loadSearchParams(request);
	const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);

	const result = await tryCatch(() => getVanBySlug(params.vanSlug));
	if (result.error) {
		throw data('Failed to load van details. Please try again later.', {
			status: 500,
		});
	}
	if (!result.data) {
		throw data('Van not found', { status: 404 });
	}
	return data(
		{
			van: result.data,
			cursor,
			limit,
			search,
			types,
			excludeInRepair,
			onlyOnSale,
		},
		{ headers: { 'Cache-Control': 'max-age=259200' } }
	);
};

const VanDetailPage = ({ loaderData }: Route.ComponentProps) => {
	const { van, cursor, limit, search, types, excludeInRepair, onlyOnSale } =
		loaderData;

	// Build back link with pagination and filter search params
	const backLink = buildVanSearchParams({
		cursor,
		limit,
		types,
		excludeInRepair,
		onlyOnSale,
		search,
		baseUrl: href('/vans'),
	});

	// Determine back link message based on active filters
	const hasActiveFilters =
		(search && search.trim() !== '') ||
		(types && types.length > 0) ||
		excludeInRepair ||
		onlyOnSale;

	const backLinkMessage = hasActiveFilters ? 'filtered' : 'all';

	return (
		<div className="grid min-h-full grid-rows-[min-content_1fr]">
			<title>{van.name} | Van Life</title>
			<meta content={`${van.name} - ${van.description}`} name="description" />

			<CustomLink to={backLink}>
				&larr; Back to <span className="uppercase">{backLinkMessage}</span> Vans
			</CustomLink>
			<div className="self-center">
				<VanDetail van={van} />
			</div>
		</div>
	);
};
export default VanDetailPage;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
	if (isRouteErrorResponse(error)) {
		return (
			<UnsuccesfulState
				isError
				message={error.statusText || 'An unknown error occurred.'}
			/>
		);
	}
	if (error instanceof Error) {
		return <UnsuccesfulState isError message="This van could not be found." />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
};
