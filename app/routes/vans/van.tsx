import clsx from 'clsx';
import { data, href, Link, redirect, useLocation } from 'react-router';
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
	const van = await getVan(params.vanId);
	if (!van) throw redirect('/notfound');
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
	const { van } = loaderData;

	const location = useLocation();

	const typeFilter = location.state?.type ?? '';

	const { changingPage } = useIsNavigating();
	return (
		<div className={clsx({ 'opacity-75': changingPage })}>
			<Link
				to={{
					pathname: href('/vans'),
					search: `?type=${typeFilter}`,
				}}
			>
				&larr; back to {typeFilter ? typeFilter : 'all'} vans
			</Link>
			<VanDetails {...van} />
		</div>
	);
}
