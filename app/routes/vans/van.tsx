import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import PendingUI from '~/components/common/PendingUI';
import CustomLink from '~/components/navigation/CustomLink';
import VanDetails from '~/components/van/VanDetail';
import { getVan } from '~/db/van/crud';
import { paginationParsers } from '~/lib/parsers';
import { tryCatch } from '~/lib/tryCatch.server';
import type { Route } from './+types/van';

export function meta({ data }: Route.MetaArgs) {
	return [
		{ title: `${data?.van.name ?? 'Unknown'} | Vanlife` },
		{
			name: 'details',
			content: `The details about ${data?.van.name ?? 'Unknown'}`,
		},
	];
}

export async function loader({ params }: Route.LoaderArgs) {
	// if (request.headers.get('referer') === href('/vans')) {
	// 	return
	// }
	if (!params.vanId) throw data('No van id', { status: 404 });

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
		},
	);
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {
	const { van } = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit, type }] = useQueryStates(paginationParsers);

	const vanIsAvailable = !van.isRented;

	// Build the back link with search parameters
	const backLinkSearch = type
		? `?cursor=${cursor}&limit=${limit}&type=${type}`
		: `?cursor=${cursor}&limit=${limit}`;

	return (
		<PendingUI className="grid grid-rows-[auto_1fr]">
			<CustomLink
				to={{
					pathname: href('/vans'),
					search: backLinkSearch,
				}}
			>
				&larr; back to {type ? type : 'all'} vans
			</CustomLink>
			<div className="self-center">
				<VanDetails van={van} vanIsAvailable={vanIsAvailable} />
			</div>
		</PendingUI>
	);
}
