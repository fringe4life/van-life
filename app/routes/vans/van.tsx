import { data, href, useLocation } from 'react-router';
import CustomLink from '~/components/CustomLink';
import PendingUI from '~/components/PendingUI';
import VanDetails from '~/components/Van/VanDetail';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';
import { getVan } from '~/db/getVan';
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

	const location = useLocation();

	// Get state from location, with fallbacks
	const state = location.state as {
		page?: number;
		limit?: number;
		type?: string;
	} | null;
	const page = state?.page ?? DEFAULT_PAGE;
	const limit = state?.limit ?? DEFAULT_LIMIT;
	const type = state?.type ?? DEFAULT_FILTER;

	const vanIsAvailable = !van.isRented;

	// Build the back link with search parameters
	const backLinkSearch = type
		? `?page=${page}&limit=${limit}&type=${type.toLowerCase()}`
		: `?page=${page}&limit=${limit}`;

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
