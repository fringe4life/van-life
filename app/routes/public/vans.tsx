import { useQueryStates } from 'nuqs';
import { ViewTransition } from 'react';
import { data, href, isRouteErrorResponse } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import { SearchInput } from '~/components/search-input';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { Pagination } from '~/features/pagination/components/pagination';
import { DEFAULT_CURSOR } from '~/features/pagination/pagination-constants';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import { VanCard } from '~/features/vans/components/van-card';
import { VanFilters } from '~/features/vans/components/van-filters';
import { VanHeader } from '~/features/vans/components/van-header';
import { VanPrice } from '~/features/vans/components/van-price';
import { getVans } from '~/features/vans/queries/queries';
import { VAN_TYPE_LOWERCASE } from '~/features/vans/types.server';
import { validateVanType } from '~/features/vans/utils/validators';
import {
	paginationParsers,
	searchParser,
	vanFiltersParser,
} from '~/lib/parsers';
import {
	loadPaginationParams,
	loadSearchParams,
	loadVanFiltersParams,
} from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/vans';

export const loader = async ({ request }: Route.LoaderArgs) => {
	// Get badges from the centralized types
	const badges = VAN_TYPE_LOWERCASE;

	// Parse search parameters using nuqs loadPaginationParams
	const { cursor, limit, type, direction } = loadPaginationParams(request);
	const { search } = loadSearchParams(request);
	const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);

	// Convert empty string to undefined for proper type handling
	const typeFilter =
		type === '' ? undefined : validateVanType(type?.toUpperCase());

	// Reset cursor when search or filters change
	const hasFilters =
		search?.trim() ||
		(types && types.length > 0) ||
		excludeInRepair ||
		onlyOnSale;
	const actualCursor = hasFilters ? DEFAULT_CURSOR : cursor;

	const { data: vans } = await tryCatch(() =>
		getVans({
			cursor: actualCursor,
			limit,
			direction,
			typeFilter,
			search,
			types,
			excludeInRepair,
			onlyOnSale,
		})
	);

	// Process pagination logic
	const pagination = toPagination({
		items: vans,
		limit,
		cursor: actualCursor,
		direction,
	});

	const loaderData = {
		badges,
		...pagination,
	};

	return data(loaderData, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
};

const Vans = ({ loaderData }: Route.ComponentProps) => {
	const { items: vans, paginationMetadata } = loaderData;
	// Use nuqs for client-side state management
	const [{ cursor, limit, type }] = useQueryStates(paginationParsers);
	const [{ search }] = useQueryStates(searchParser);
	const [{ types, excludeInRepair, onlyOnSale }] =
		useQueryStates(vanFiltersParser);

	const hasActiveSearch = search && search.trim() !== '';
	const hasActiveFilters =
		hasActiveSearch ||
		(types && types.length > 0) ||
		excludeInRepair ||
		onlyOnSale;

	const emptyMessage = hasActiveFilters
		? 'No vans found matching your filters.'
		: 'There are no vans on our site.';

	return (
		<>
			<title>Vans | Van Life</title>
			<meta
				content="Browse our vans for rent and find the perfect van for your adventure"
				name="description"
			/>
			<ViewTransition>
				<PendingUI
					as="section"
					className="grid h-full w-full! grid-rows-[min-content_min-content_1fr_min-content] gap-y-6 contain-content"
				>
					<VanHeader>Explore our van options</VanHeader>

					<div className="grid grid-cols-[1fr_min-content] items-center gap-2">
						<SearchInput />
						<VanFilters />
					</div>
					<GenericComponent
						Component={VanCard}
						className="grid-max"
						emptyStateMessage={emptyMessage}
						errorStateMessage="Something went wrong"
						items={vans}
						renderKey={(van) => van.id}
						renderProps={(van) => ({
							van,
							filter: type,
							action: (
								<div className="grid justify-end">
									<VanPrice van={van} />
								</div>
							),
							link: buildVanSearchParams({
								cursor,
								limit,
								type,
								baseUrl: href('/vans/:vanSlug', {
									vanSlug: van.slug,
								}),
							}),
						})}
					/>
					<Pagination items={vans} paginationMetadata={paginationMetadata} />
				</PendingUI>
			</ViewTransition>
		</>
	);
};
export default Vans;

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
		return <UnsuccesfulState isError message={error.message} />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
};
