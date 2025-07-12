import { VanType } from '@prisma/client';

import { data, href, NavLink, useSearchParams } from 'react-router';
import { badgeVariants } from '~/components/ui/badge';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { DEFAULT_FILTER } from '~/constants/constants';
import { getVans } from '~/db/getVans';
import { getVansCount } from '~/db/getVansCount';
import { getPaginationParams } from '~/utils/getPaginationParams';
import { getParamsClientSide } from '~/utils/getParamsClientSide';
import type { Route } from './+types/vans';

export function meta(_: Route.MetaArgs) {
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

	const vans = await getVans(page, limit, type as VanType);
	const vansCount = await getVansCount(type as VanType);

	return data(
		{ vans, badges, vansCount },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function Vans({ loaderData }: Route.ComponentProps) {
	const { vans, badges, vansCount } = loaderData;

	const [searchParams] = useSearchParams();
	const { type: typeFilter } = getParamsClientSide(searchParams);

	return (
		<VanPages
			// generic component props
			Component={VanCard}
			emptyStateMessage='There are no vans in our site.'
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				van,
				filter: typeFilter ? typeFilter : DEFAULT_FILTER,
				action: (
					<p className="@max-md/card:col-start-2 @md/card:row-span-2 @md/card:self-center @max-md/card:justify-self-end @md/card:justify-self-end text-lg">
						${van.price}
						<p className="@max-md/card:inline @md/card:text-right text-base">
							{' '}
							/day
						</p>
					</p>
				),
				link: href('/vans/:vanId', { vanId: van.id }),
			})}
			items={vans}
			itemsCount={vansCount}
			// generic component props end
			// used to highlight its unique props as part of a discriminated union
			variant="vans"
			//  vans part of discriminated union
			listItem={{
				items: badges,
				getKey: (t) => t.toLowerCase(),
				getRow: (t) => (
					<NavLink
						className={badgeVariants({
							variant: t === typeFilter.toUpperCase() ? t : 'OUTLINE',
						})}
						to={{ search: `?type=${t.toLowerCase()}` }}
					>
						{t}
					</NavLink>
				),
			}}
			// props for all use cases
			path={href('/vans')}
			title="Explore our van options"
		/>
	);
}
