import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import PendingUI from '~/components/pending-ui';
import { getVan } from '~/db/van/crud';
import CustomLink from '~/features/navigation/components/custom-link';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import VanDetails from '~/features/vans/components/van-detail';
import { paginationParsers } from '~/lib/parsers';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/van';

export function meta({ loaderData }: Route.MetaArgs) {
	return [
		{ title: `${loaderData?.van.name ?? 'Unknown'} | Vanlife` },
		{
			name: 'details',
			content: `The details about ${loaderData?.van.name ?? 'Unknown'}`,
		},
	];
}

export async function loader({ params }: Route.LoaderArgs) {
	const result = await tryCatch(() => getVan(params.vanId));

	if (result.error) {
		throw data('Failed to load van details. Please try again later.', {
			status: 500,
		});
	}

	if (!result.data || typeof result.data === 'string') {
		throw data('Van not found', { status: 404 });
	}

	return data(
		{ van: result.data },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {
	const { van } = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit, type }] = useQueryStates(paginationParsers);

	// Build the back link with search parameters
	const backLinkSearch = buildVanSearchParams({ cursor, limit, type });

	return (
		<PendingUI className="grid grid-rows-[auto_1fr]">
			<CustomLink
				to={{
					pathname: href('/vans'),
					search: backLinkSearch,
				}}
			>
				&larr; back to <span className="uppercase">{type ? type : 'all'}</span>{' '}
				vans
			</CustomLink>
			<div className="self-center">
				<VanDetails van={van} />
			</div>
		</PendingUI>
	);
}
