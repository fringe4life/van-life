import { data, href, Outlet } from 'react-router';
import PendingUi from '~/components/pending-ui';
import { getHostVanBySlug } from '~/db/van/host';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import VanDetailCard from '~/features/vans/components/host-van-detail-card';
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

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ params, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	const result = await tryCatch(() =>
		getHostVanBySlug(session.user.id, params.vanSlug)
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
				<PendingUi pendingOpacity={0.5}>
					<Outlet context={van} />
				</PendingUi>
			</VanDetailCard>
		</>
	);
}
