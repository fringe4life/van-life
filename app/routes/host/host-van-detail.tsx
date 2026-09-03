import { Activity } from "react";
import { data, href } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { determineHostVansRoute } from "~/features/host/utils/determine-host-vans-route";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { loadHostSearchParams } from "~/features/pagination/loaders.server";
import { buildVanUrl } from "~/features/pagination/utils/build-search-params";
import { VanDetailCard } from "~/features/vans/components/host detail";
import { getHostVanBySlug } from "~/features/vans/dal/host-van.server";
import { notFound } from "~/utils/errors/not-found";
import { tryCatch } from "~/utils/errors/try-catch.server";
import type { Route } from "./+types/host-van-detail";

export const headers = forwardDataHeaders;

export const loader = async ({
  params,
  request,
  context,
}: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  // Parse search parameters from URL to preserve pagination state
  const { cursor, limit } = loadHostSearchParams(request);

  const { data: van } = await tryCatch(() =>
    getHostVanBySlug(db, user.id, params.vanSlug)
  );

  if (!van) {
    notFound("Van not found");
  }

  return data({ cursor, limit, van }, { headers: PRIVATE_NO_STORE_HEADERS });
};

const HostVanDetailPage = ({ loaderData, params }: Route.ComponentProps) => {
  const { van, cursor, limit } = loaderData;

  // Determine which view to show based on action parameter
  const { isDetailsView, isPhotosView, isPricingView } =
    determineHostVansRoute(params);

  // Build back link with pagination search params
  const backLink = buildVanUrl({
    baseUrl: href("/host/vans"),
    cursor,
    limit,
  });

  return (
    <div
      className={cx(
        grid({
          gap: "0",
          gridTemplateAreas: '"back" "detail"',
          gridTemplateRows: "min-content 1fr",
        }),
        css({
          minBlockSize: "full",
        })
      )}
    >
      <title>{`${van.name} | Van Life`}</title>
      <meta content={`${van.name} - ${van.description}`} name="description" />

      <CustomLink className={css({ gridArea: "back" })} to={backLink}>
        &larr; Back to Your Vans
      </CustomLink>

      <div className={css({ alignSelf: "center", gridArea: "detail" })}>
        <VanDetailCard van={van}>
          <Activity mode={isDetailsView ? "visible" : "hidden"}>
            <VanDetailCard.Details />
          </Activity>
          <Activity mode={isPhotosView ? "visible" : "hidden"}>
            <VanDetailCard.Photos />
          </Activity>
          <Activity mode={isPricingView ? "visible" : "hidden"}>
            <VanDetailCard.Pricing />
          </Activity>
        </VanDetailCard>
      </div>
    </div>
  );
};
export default HostVanDetailPage;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary
    error={error}
    errorFallback="This van could not be found."
  />
);
