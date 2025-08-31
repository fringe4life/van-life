import type { VanType } from '@prisma/client';
import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import ListItems from '~/components/common/ListItems';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import VanCard from '~/components/van/VanCard';
import VanPages from '~/components/van/VanPages';
import { DEFAULT_PAGE } from '~/constants/constants';
import { getVans, getVansCount } from '~/db/van/queries';
import { paginationParsers } from '~/lib/parsers';
import { loadSearchParams } from '~/lib/searchParams.server';
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
	const { page, limit, type } = loadSearchParams(request);

	// Convert empty string to undefined for proper type handling
	const typeFilter = type === '' ? undefined : (type?.toUpperCase() as VanType);

	const results = await Promise.allSettled([
		getVans(page, limit, typeFilter),
		getVansCount(typeFilter),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);

	return data(
		{
			vans: vans as Awaited<ReturnType<typeof getVans>>,
			badges,
			vansCount: vansCount as Awaited<ReturnType<typeof getVansCount>>,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function Vans({ loaderData }: Route.ComponentProps) {
	const { vans, badges, vansCount } = loaderData;

	// Use nuqs for client-side state management
	const [{ page, limit, type }, setSearchParams] =
		useQueryStates(paginationParsers);

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
						? `?page=${page}&limit=${limit}&type=${type}`
						: `?page=${page}&limit=${limit}`),
			})}
			items={vans}
			itemsCount={vansCount}
			// generic component props end

			// props for all use cases
			pathname={href('/vans')}
			title="Explore our van options"
			searchParams={{ page, limit, type }}
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
										setSearchParams({ type: t, page: DEFAULT_PAGE });
									}}
								>
									{t}
								</Button>
							)}
						/>
					}
					<Button
						variant="ghost"
						className="w-full text-center sm:w-fit sm:text-left"
						onClick={() => {
							setSearchParams({ type: undefined, page: DEFAULT_PAGE });
						}}
					>
						Clear filters
					</Button>
				</div>
			}
		/>
	);
}
