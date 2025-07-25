import { VanType } from '@prisma/client';

import { data, href } from 'react-router';
import CustomNavLink from '~/components/CustomNavLink';
import ListItems from '~/components/ListItems';
import { badgeVariants } from '~/components/ui/badge';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { DEFAULT_FILTER } from '~/constants/constants';
import { getVans } from '~/db/getVans';
import { getVansCount } from '~/db/getVansCount';
import { useParamsClientSide } from '~/hooks/useParamsClientSide';
import { getPaginationParams } from '~/utils/getPaginationParams';
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

	// const { cursor, limit, type } = getCursorPagination(request.url);
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

	const { type } = useParamsClientSide();

	return (
		<VanPages
			// generic component props
			Component={VanCard}
			emptyStateMessage="There are no vans in our site."
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				van,
				filter: type ? type : DEFAULT_FILTER,
				action: (
					<p className="text-right text-lg">
						${van.price}
						<span className="@max-md/card:inline @md/card:text-right text-base">
							/day
						</span>
					</p>
				),
				link: href('/vans/:vanId', { vanId: van.id }),
			})}
			items={vans}
			itemsCount={vansCount}
			// generic component props end

			// props for all use cases
			pathname={href('/vans')}
			title="Explore our van options"
			optionalElement={
				<p className="mb-6 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4 md:justify-start">
					{
						<ListItems
							items={badges}
							getKey={(t) => t}
							getRow={(t) => (
								<CustomNavLink
									className={badgeVariants({
										variant: t === type ? t : 'OUTLINE',
									})}
									to={{ search: `?type=${t.toLowerCase()}` }}
								>
									{t}
								</CustomNavLink>
							)}
						/>
					}
					<CustomNavLink
						to={href('/vans')}
						className={(isActive) => isActive && 'underline'}
					>
						Clear filters
					</CustomNavLink>
				</p>
			}
		/>
	);
}
