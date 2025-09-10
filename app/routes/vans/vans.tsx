import { clsx } from 'clsx';
import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import ListItems from '~/components/common/ListItems';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import VanCard from '~/components/van/VanCard';
import VanPages from '~/components/van/VanPages';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
} from '~/constants/paginationConstants';
import { getVans, getVansCount } from '~/db/van/queries';
import type { VanType } from '~/generated/prisma/enums';
import { hasPagination } from '~/lib/hasPagination.server';
import { paginationParsers } from '~/lib/parsers';
import { loadSearchParams } from '~/lib/searchParams.server';
import type { QueryType } from '~/types/types.server';
import { VAN_TYPE_LOWERCASE } from '~/types/types.server';
import { cn } from '~/utils/utils';
import type { Route } from './+types/vans';

export function meta() {
	return [
		{ title: 'Vans | Vanlife' },
		{
			name: 'description',
			content: 'Browse our vans for rent',
		},
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	// Get badges from the centralized types
	const badges = VAN_TYPE_LOWERCASE;

	// Parse search parameters using nuqs loadSearchParams
	const { cursor, limit, type, direction } = loadSearchParams(request);

	// Convert empty string to undefined for proper type handling
	const typeFilter = type === '' ? undefined : (type?.toUpperCase() as VanType);

	const results = await Promise.allSettled([
		getVans(cursor, limit, typeFilter, direction),
		getVansCount(typeFilter),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);

	// Process pagination logic
	const pagination = hasPagination(vans, limit, cursor, direction);

	const loaderData = {
		badges,
		vansCount: vansCount as QueryType<typeof getVansCount>,
		...pagination,
	};

	return data(loaderData, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
}

export default function Vans({ loaderData }: Route.ComponentProps) {
	const {
		actualItems: vans,
		badges,
		hasNextPage,
		hasPreviousPage,
	} = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit, type }, setSearchParams] =
		useQueryStates(paginationParsers);

	// Derive state to check if type filter is active
	const hasActiveTypeFilter = type !== DEFAULT_FILTER;

	// Ensure vans is an array
	const vansArray = Array.isArray(vans) ? vans : [];

	return (
		<VanPages
			// generic component props
			Component={VanCard}
			emptyStateMessage="There are no vans in our site."
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				van,
				filter: type,
				action: (
					<p className="text-right text-lg">
						${van.price}
						<span className="@max-md/card:inline @md/card:text-right text-base">
							/day
						</span>
					</p>
				),
				link:
					href('/vans/:vanId', { vanId: van.id }) +
					(type
						? `?cursor=${cursor}&limit=${limit}&type=${type}`
						: `?cursor=${cursor}&limit=${limit}`),
			})}
			items={vansArray}
			// generic component props end

			// props for all use cases
			pathname={href('/vans')}
			title="Explore our van options"
			searchParams={{ cursor, limit, type }}
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
			optionalElement={
				<div className="mb-6 grid grid-cols-2 items-center gap-2 sm:grid-cols-[min-content_min-content_min-content_max-content] sm:gap-4">
					{
						<ListItems
							items={badges}
							getKey={(t) => t}
							getRow={(t) => (
								<Button
									variant="ghost"
									className={cn(
										badgeVariants({
											variant: t === type ? t : 'outline',
										}),
										'w-full uppercase sm:w-fit',
									)}
									onClick={() => {
										setSearchParams({
											type: t,
											cursor: DEFAULT_CURSOR,
											direction: DEFAULT_DIRECTION,
										});
									}}
								>
									{t}
								</Button>
							)}
						/>
					}
					<Button
						variant="ghost"
						className={clsx(
							'w-full text-center sm:w-fit sm:text-left',
							hasActiveTypeFilter && 'underline',
						)}
						onClick={() => {
							setSearchParams({
								type: DEFAULT_FILTER,
								cursor: DEFAULT_CURSOR,
								direction: DEFAULT_DIRECTION,
							});
						}}
					>
						Clear filters
					</Button>
				</div>
			}
		/>
	);
}
