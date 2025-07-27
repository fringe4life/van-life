import clsx from 'clsx';
import { data, href, useLocation } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanDetails from '~/components/Van/VanDetail';
import { getVan } from '~/db/getVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { tryCatch } from '~/lib/tryCatch.server';
import type { Route } from './+types/van';

export function meta({ data }: Route.MetaArgs) {
	if (!data?.van) {
		return [
			{ title: 'Not found | Vanlife' },
			{
				name: 'details',
				content: 'This van was not found',
			},
		];
	}
	return [
		{ title: `${data.van.name} | Vanlife` },
		{
			name: 'details',
			content: `The details about ${data.van.name}`,
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

	const typeFilter = location.state?.type ?? '';

	const vanIsAvailable = !van.isRented;

	const { changingPage } = useIsNavigating();
	return (
		<div
			className={clsx({
				'opacity-75': changingPage,
				'grid grid-rows-[auto_1fr]': true,
			})}
		>
			<CustomLink
				to={{
					pathname: href('/vans'),
					search: `?type=${typeFilter}`,
				}}
			>
				&larr; back to {typeFilter ? typeFilter : 'all'} vans
			</CustomLink>
			<div className="self-center">
				<VanDetails van={van} vanIsAvailable={vanIsAvailable} />
			</div>
		</div>
	);
}
