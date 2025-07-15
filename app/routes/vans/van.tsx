import clsx from 'clsx';
import { data, href, useLocation } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanDetails from '~/components/Van/VanDetail';
import { getVan } from '~/db/getVan';
import useIsNavigating from '~/hooks/useIsNavigating';
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
	const van = await getVan(params.vanId);
	if (!van) throw data('Van not found', { status: 404 });
	return data(
		{ van },
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {
	const {
		van: { rent, ...van },
	} = loaderData;

	const location = useLocation();

	const typeFilter = location.state?.type ?? '';

	const vanIsAvailable = rent?.every((v) => v.rentedTo !== null) ?? true;

	const { changingPage } = useIsNavigating();
	return (
		<div className={clsx({ 'opacity-75': changingPage })}>
			<CustomLink
				to={{
					pathname: href('/vans'),
					search: `?type=${typeFilter}`,
				}}
			>
				&larr; back to {typeFilter ? typeFilter : 'all'} vans
			</CustomLink>
			<VanDetails van={van} vanIsAvailable={vanIsAvailable} />
		</div>
	);
}
