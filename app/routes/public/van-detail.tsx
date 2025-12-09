import { data, href, isRouteErrorResponse } from 'react-router';
import UnsuccesfulState from '~/components/unsuccesful-state';
import CustomLink from '~/features/navigation/components/custom-link';
import { buildVanSearchParams } from '~/features/pagination/utils/build-search-params';
import VanDetail from '~/features/vans/components/van-detail';
import { getVanBySlug } from '~/features/vans/queries/queries';
import { loadSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/van-detail';

export async function loader({ params, request }: Route.LoaderArgs) {
	// Parse search parameters from URL to preserve pagination state
	const { cursor, limit, type } = loadSearchParams(request);

	const result = await tryCatch(() => getVanBySlug(params.vanSlug));
	if (result.error) {
		throw data('Failed to load van details. Please try again later.', {
			status: 500,
		});
	}
	if (!result.data) {
		throw data('Van not found', { status: 404 });
	}
	return data(
		{ van: result.data, cursor, limit, type },
		{ headers: { 'Cache-Control': 'max-age=259200' } }
	);
}

export default function VanDetailPage({ loaderData }: Route.ComponentProps) {
	const { van, cursor, limit, type } = loaderData;

	// Build back link with pagination search params
	const baseUrl = href('/vans');
	const search = buildVanSearchParams({
		cursor,
		limit,
		type,
	});
	const backLink = search ? `${baseUrl}?${search}` : baseUrl;

	return (
		<div className="grid min-h-full grid-rows-[min-content_1fr]">
			<title>{van.name} | Van Life</title>
			<meta content={`${van.name} - ${van.description}`} name="description" />

			<CustomLink to={backLink}>
				&larr; Back to{' '}
				<span className="uppercase">{van.type ? van.type : 'all'}</span> Vans
			</CustomLink>
			<div className="self-center">
				<VanDetail van={van} />
			</div>
		</div>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		return (
			<UnsuccesfulState
				isError
				message={error.statusText || 'An unknown error occurred.'}
			/>
		);
	}
	if (error instanceof Error) {
		return <UnsuccesfulState isError message="This van could not be found." />;
	}
	return <UnsuccesfulState isError message="An unknown error occurred." />;
}
