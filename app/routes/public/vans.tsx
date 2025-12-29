import { clsx } from 'clsx';
import { useQueryStates } from 'nuqs';
import { startTransition, ViewTransition } from 'react';
import { data, href, isRouteErrorResponse } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { ListItems } from '~/components/list-items';
import { PendingUI } from '~/components/pending-ui';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { Pagination } from '~/features/pagination/components/pagination';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
} from '~/features/pagination/pagination-constants';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import { VanCard } from '~/features/vans/components/van-card';
import { VanHeader } from '~/features/vans/components/van-header';
import { VanPrice } from '~/features/vans/components/van-price';
import { getVans } from '~/features/vans/queries/queries';
import { VAN_TYPE_LOWERCASE } from '~/features/vans/types.server';
import { validateVanType } from '~/features/vans/utils/validators';
import { paginationParsers } from '~/lib/parsers';
import { loadSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import { cn } from '~/utils/utils';
import type { Route } from './+types/vans';

export const loader = async ({ request }: Route.LoaderArgs) => {
	// Get badges from the centralized types
	const badges = VAN_TYPE_LOWERCASE;

	// Parse search parameters using nuqs loadSearchParams
	const { cursor, limit, type, direction } = loadSearchParams(request);

	// Convert empty string to undefined for proper type handling
	const typeFilter =
		type === '' ? undefined : validateVanType(type?.toUpperCase());

	const { data: vans } = await tryCatch(() =>
		getVans({ cursor, limit, direction, typeFilter })
	);

	// Process pagination logic
	const pagination = toPagination({ items: vans, limit, cursor, direction });

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

export default function Vans({ loaderData }: Route.ComponentProps) {
	const { items: vans, badges, paginationMetadata } = loaderData;
	// Use nuqs for client-side state management
	const [{ cursor, limit, type }, setSearchParams] =
		useQueryStates(paginationParsers);

	// Derive state to check if type filter is active
	const hasActiveTypeFilter = type !== DEFAULT_FILTER;

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
					className="grid h-full grid-rows-[min-content_min-content_1fr_min-content] gap-y-6 contain-content"
				>
					<VanHeader>Explore our van options</VanHeader>
					<div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[min-content_min-content_min-content_max-content] sm:gap-4">
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
										startTransition(async () => {
											await setSearchParams({
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
								startTransition(async () => {
									await setSearchParams({
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
						className="grid-max"
						emptyStateMessage="There are no vans on our site."
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
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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
}
