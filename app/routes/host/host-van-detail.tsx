import { Activity } from 'react';
import { data, href, isRouteErrorResponse } from 'react-router';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { determineHostVansRoute } from '~/features/host/utils/determine-host-vans-route';
import { authContext } from '~/features/middleware/contexts/auth';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { buildVanUrl } from '~/features/pagination/utils/build-search-params';
import { VanDetailCard } from '~/features/vans/components/host detail';
import { getHostVanBySlug } from '~/features/vans/dal/host-van.server';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/host-van-detail';

export const loader = async ({
	params,
	request,
	context,
}: Route.LoaderArgs) => {
	const user = context.get(authContext);

	// Parse search parameters from URL to preserve pagination state
	const { cursor, limit } = loadHostSearchParams(request);

	const { data: van } = await tryCatch(() =>
		getHostVanBySlug(user.id, params.vanSlug)
	);

	if (!van) {
		throw data('Van not found', { status: 404 });
	}

	return data(
		{ van, cursor, limit },
		{ headers: { 'Cache-Control': 'max-age=259200' } }
	);
};

const HostVanDetailPage = ({ loaderData, params }: Route.ComponentProps) => {
	const { van, cursor, limit } = loaderData;

	// Determine which view to show based on action parameter
	const { isDetailsView, isPhotosView, isPricingView } =
		determineHostVansRoute(params);

	// Build back link with pagination search params
	const backLink = buildVanUrl({
		cursor,
		limit,
		baseUrl: href('/host/vans'),
	});

	return (
		<div className="grid min-h-full grid-rows-[min-content_1fr]">
			<title>{van.name} | Van Life</title>
			<meta content={`${van.name} - ${van.description}`} name="description" />

			<CustomLink to={backLink}>&larr; Back to Your Vans</CustomLink>
			<div className="self-center">
				<VanDetailCard van={van}>
					<Activity mode={isDetailsView ? 'visible' : 'hidden'}>
						<VanDetailCard.Details />
					</Activity>
					<Activity mode={isPhotosView ? 'visible' : 'hidden'}>
						<VanDetailCard.Photos />
					</Activity>
					<Activity mode={isPricingView ? 'visible' : 'hidden'}>
						<VanDetailCard.Pricing />
					</Activity>
				</VanDetailCard>
			</div>
		</div>
	);
};
export default HostVanDetailPage;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
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
};
