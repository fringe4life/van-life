import { useQueryStates } from 'nuqs';
import { ViewTransition } from 'react';
import { data, href, isRouteErrorResponse } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import { SearchInput } from '~/components/search-input';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { Pagination } from '~/features/pagination/components/pagination';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import { SeoHead } from '~/features/seo/seo-head';
import { VanCard } from '~/features/vans/components/van-card';
import { VanFilters } from '~/features/vans/components/van-filters';
import { VanHeader } from '~/features/vans/components/van-header';
import { VanPrice } from '~/features/vans/components/van-price';
import { loadVanCatalog } from '~/features/vans/services/catalog.server';
import {
	paginationParsers,
	searchParser,
	vanFiltersParser,
} from '~/lib/parsers';
import type { Route } from './+types/vans';

export const loader = async ({ request }: Route.LoaderArgs) => {
	const loaderData = await loadVanCatalog(request);

	return data(loaderData, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
};

const Vans = ({ loaderData }: Route.ComponentProps) => {
	const { items: vans, paginationMetadata, seo } = loaderData;
	const [{ cursor, limit }] = useQueryStates(paginationParsers);
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
		<ViewTransition>
			<SeoHead {...seo} />
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
					renderProps={(van) => ({
						van,
						action: (
							<div className="grid justify-end">
								<VanPrice van={van} />
							</div>
						),
						link: buildVanSearchParams({
							cursor,
							limit,
							types,
							excludeInRepair,
							onlyOnSale,
							search,
							baseUrl: href('/vans/:vanSlug', {
								vanSlug: van.slug,
							}),
						}),
					})}
				/>
				<Pagination items={vans} paginationMetadata={paginationMetadata} />
			</PendingUI>
		</ViewTransition>
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
