import { clsx } from 'clsx';
import { useQueryStates } from 'nuqs';
import { Activity, useTransition, ViewTransition } from 'react';
import { data, href, type ShouldRevalidateFunctionArgs } from 'react-router';
import GenericComponent from '~/components/generic-component';
import ListItems from '~/components/list-items';
import PendingUi from '~/components/pending-ui';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { getVans, getVansCount } from '~/db/van/queries';
import CustomLink from '~/features/navigation/components/custom-link';
import Pagination from '~/features/pagination/components/pagination';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
} from '~/features/pagination/pagination-constants';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanCard from '~/features/vans/components/van-card';
import VanDetail from '~/features/vans/components/van-detail';
import VanHeader from '~/features/vans/components/van-header';
import VanPrice from '~/features/vans/components/van-price';
import { paginationParsers } from '~/lib/parsers';
import { loadSearchParams } from '~/lib/search-params.server';
import { VAN_TYPE_LOWERCASE } from '~/types/types.server';
import { tryCatch } from '~/utils/try-catch.server';
import { cn } from '~/utils/utils';
import { validateVanType } from '~/utils/validators';
import type { Route } from './+types/vans';

export async function loader({ request }: Route.LoaderArgs) {
	// Get badges from the centralized types
	const badges = VAN_TYPE_LOWERCASE;

	// Parse search parameters using nuqs loadSearchParams
	const { cursor, limit, type, direction } = loadSearchParams(request);

	// Convert empty string to undefined for proper type handling
	const typeFilter =
		type === '' ? undefined : validateVanType(type?.toUpperCase());

	const [vansResult, countResult] = await Promise.all([
		tryCatch(() => getVans(cursor, limit, typeFilter, direction)),
		tryCatch(() => getVansCount(typeFilter)),
	]);

	// Handle errors with proper type inference
	const vans = vansResult.data ?? [];
	const vansCount = countResult.data ?? 0;

	// Process pagination logic
	const pagination = hasPagination(vans, limit, cursor, direction);

	const loaderData = {
		badges,
		vansCount,
		...pagination,
	};

	return data(loaderData, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
}

/**
 * Prevent loader revalidation when navigating from list to detail or vice versa
 * with the same filters/pagination. Only revalidate when filters or pagination change.
 */
export function shouldRevalidate({
	currentParams,
	nextParams,
	currentUrl,
	nextUrl,
	formMethod,
}: ShouldRevalidateFunctionArgs) {
	// Always revalidate on form submissions
	if (formMethod && formMethod !== 'GET') {
		return true;
	}

	// If vanSlug changed (list → detail or detail → different detail), revalidate
	if (currentParams.vanSlug !== nextParams.vanSlug) {
		return true;
	}

	// If search params changed (filters, pagination), revalidate
	if (currentUrl.searchParams.toString() !== nextUrl.searchParams.toString()) {
		return true;
	}

	// Same filters/pagination, just toggling between list and detail view
	// No need to revalidate - we already have the data
	return false;
}

export default function Vans({ loaderData, params }: Route.ComponentProps) {
	const {
		actualItems: vans,
		badges,
		hasNextPage,
		hasPreviousPage,
	} = loaderData;
	const [_, startTransition] = useTransition();
	// Use nuqs for client-side state management
	const [{ cursor, limit, type }, setSearchParams] =
		useQueryStates(paginationParsers);

	// Derive state to check if type filter is active
	const hasActiveTypeFilter = type !== DEFAULT_FILTER;
	const isVanDetailPage = params.vanSlug !== undefined;

	// Ensure vans is an array
	const vansArray = Array.isArray(vans) ? vans : [];

	// Find the selected van by slug if on detail page
	const selectedVan = isVanDetailPage
		? vansArray.find((van) => van.slug === params.vanSlug)
		: null;

	return (
		<>
			<title>Vans | Van Life</title>
			<meta
				content="Browse our vans for rent and find the perfect van for your adventure"
				name="description"
			/>
			{/* Van detail view - prerendered for fast navigation */}

			<Activity mode={isVanDetailPage ? 'visible' : 'hidden'}>
				<div className="grid grid-rows-[min-content_1fr]">
					{selectedVan ? (
						<>
							<CustomLink to={href('/vans/:vanSlug?')}>
								&larr; Back to{' '}
								<span className="uppercase">{type ? type : 'all'}</span> Vans
							</CustomLink>
							<div className="self-center">
								<VanDetail van={selectedVan} />
							</div>
						</>
					) : (
						<UnsuccesfulState message="Van not found" />
					)}
				</div>
			</Activity>

			{/* Van list view - prerendered for fast navigation back */}
			<ViewTransition>
				<Activity mode={isVanDetailPage ? 'hidden' : 'visible'}>
					<PendingUi
						as="section"
						className="grid grid-rows-[min-content_min-content_1fr_min-content] contain-content"
					>
						<VanHeader>Explore our van options</VanHeader>
						<div className="mb-6 grid grid-cols-2 items-center gap-2 sm:grid-cols-[min-content_min-content_min-content_max-content] sm:gap-4">
							<ListItems
								getKey={(t) => t}
								getRow={(t) => (
									<Button
										className={cn(
											badgeVariants({
												variant: t === type ? t : 'outline',
											}),
											'w-full cursor-pointer uppercase sm:w-fit'
										)}
										onClick={() => {
											startTransition(() => {
												setSearchParams({
													type: t,
													cursor: DEFAULT_CURSOR,
													direction: DEFAULT_DIRECTION,
												});
											});
										}}
										variant="ghost"
									>
										{t}
									</Button>
								)}
								items={badges}
							/>

							<Button
								className={clsx(
									'w-full cursor-pointer text-center sm:w-fit sm:text-left',
									Boolean(hasActiveTypeFilter) && 'underline'
								)}
								onClick={() => {
									startTransition(() => {
										setSearchParams({
											type: DEFAULT_FILTER,
											cursor: DEFAULT_CURSOR,
											direction: DEFAULT_DIRECTION,
										});
									});
								}}
								variant="ghost"
							>
								Clear filters
							</Button>
						</div>
						<GenericComponent
							Component={VanCard}
							className="grid-max mt-6"
							emptyStateMessage="There are no vans in our site."
							items={vansArray}
							renderKey={(van) => van.id}
							renderProps={(van) => ({
								van,
								filter: type,
								action: (
									<div className="grid justify-end">
										<VanPrice van={van} />
									</div>
								),
								link: (() => {
									const baseUrl = href('/vans/:vanSlug?', {
										vanSlug: van.slug,
									});
									const search = buildVanSearchParams({
										cursor,
										limit,
										type,
									});
									// biome-ignore lint/nursery/noLeakedRender:  TODO
									return search ? `${baseUrl}?${search}` : baseUrl;
								})(),
							})}
						/>
						<Pagination
							cursor={cursor}
							hasNextPage={hasNextPage}
							hasPreviousPage={hasPreviousPage}
							items={vansArray}
							limit={limit}
							pathname={href('/vans/:vanSlug?')}
						/>
					</PendingUi>
				</Activity>
			</ViewTransition>
		</>
	);
}
