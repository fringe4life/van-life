import { VanType } from '@prisma/client';

import { data, href } from 'react-router';
import ListItems from '~/components/common/ListItems';
import CustomNavLink from '~/components/navigation/CustomNavLink';
import { badgeVariants } from '~/components/ui/badge';
import VanCard from '~/components/van/VanCard';
import VanPages from '~/components/van/VanPages';
import { DEFAULT_FILTER } from '~/constants/constants';
import { getVans, getVansCount } from '~/db/van/queries';
import { useParamsClientSide } from '~/hooks/useParamsClientSide';
import { getPaginationParams } from '~/lib/getPaginationParams.server';
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
	const badges = Object.values(VanType);
	const { page, limit, type } = getPaginationParams(request.url);

	const results = await Promise.allSettled([
		getVans(page, limit, type as VanType),
		getVansCount(type as VanType),
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

	const params = useParamsClientSide();

	return (
		<VanPages
			// generic component props
			Component={VanCard}
			emptyStateMessage="There are no vans in our site."
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				van,
				filter: params.type ? params.type : DEFAULT_FILTER,
				action: (
					<p className="text-right text-lg">
						${van.price}
						<span className="@max-md/card:inline @md/card:text-right text-base">
							/day
						</span>
					</p>
				),
				link: href('/vans/:vanId', { vanId: van.id }),
				state: params,
			})}
			items={vans}
			itemsCount={vansCount}
			// generic component props end

			// props for all use cases
			pathname={href('/vans')}
			title="Explore our van options"
			optionalElement={
				<div className="mb-6 grid grid-cols-2 items-center gap-2 sm:grid-cols-[min-content_min-content_min-content_max-content] sm:gap-4">
					{
						<ListItems
							items={badges}
							getKey={(t) => t}
							getRow={(t) => (
								<CustomNavLink
									className={cn(
										badgeVariants({
											variant: t === params.type ? t : 'OUTLINE',
										}),
										'w-full sm:w-fit',
									)}
									to={{ search: `?type=${t.toLowerCase()}` }}
								>
									{t}
								</CustomNavLink>
							)}
						/>
					}
					<CustomNavLink
						to={href('/vans')}
						className={(isActive) =>
							cn(
								'w-full text-center sm:w-fit sm:text-left',
								isActive && 'underline',
							)
						}
					>
						Clear filters
					</CustomNavLink>
				</div>
			}
		/>
	);
}
