import { data, href, Outlet } from 'react-router';
import PendingUI from '~/components/pending-ui';
import { getHostVan } from '~/db/van/host';
import CustomLink from '~/features/navigation/components/custom-link';
import VanDetailCard from '~/features/vans/components/host-van-detail-card';
import { getSessionOrRedirect } from '~/lib/get-session-or-redirect.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/vanDetailLayout';
export function meta({ loaderData }: Route.MetaArgs) {
	return [
		{ title: `${loaderData?.van?.name ?? 'unknown'} | Vanlife` },
		{
			name: 'details',
			content: `The details about ${loaderData?.van?.name ?? 'unknown'} van`,
		},
	];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	const result = await tryCatch(() =>
		getHostVan(session.user.id, params.vanId)
	);

	if (result.error) {
		throw data('Failed to load van details. Please try again later.', {
			status: 500,
		});
	}

	if (!result.data || typeof result.data === 'string') {
		throw data('Van not found', { status: 404 });
	}

	return data(
		{
			van: result.data,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...cookies,
			},
		}
	);
}

export default function VanDetailLayout({ loaderData }: Route.ComponentProps) {
	const { van } = loaderData;

	return (
		<>
			<CustomLink
				className="mt-4 mb-2 sm:mt-8 sm:mb-4 md:mt-15 md:mb-8"
				to={href('/host/vans')}
			>
				&larr; Back to all vans
			</CustomLink>
			<VanDetailCard className="mx-auto" van={van}>
				<PendingUI pendingOpacity={0.5}>
					<Outlet context={van} />
				</PendingUI>
			</VanDetailCard>
		</>
	);
}
