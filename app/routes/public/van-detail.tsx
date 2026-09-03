import { data, href } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { dbContext } from "~/features/middleware/contexts/db";
import { buildVanUrl } from "~/features/pagination/utils/build-search-params";
import { buildVanDetailPageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import VanDetail from "~/features/vans/components/van-detail";
import { loadVansSearchParams } from "~/features/vans/loaders.server";
import { loadVanBySlug } from "~/features/vans/services/van-detail.server";
import { notFound } from "~/utils/errors/not-found";
import { serverError } from "~/utils/errors/server-error";
import type { Route } from "./+types/van-detail";

export const headers = forwardDataHeaders;

export const loader = async ({
  params,
  request,
  context,
}: Route.LoaderArgs) => {
  const db = context.get(dbContext);

  const { cursor, limit, search, types, excludeInRepair, onlyOnSale } =
    loadVansSearchParams(request);

  const { vanSlug } = params;
  if (!vanSlug) {
    notFound("Van not found");
  }

  const result = await loadVanBySlug(db, vanSlug);
  if (result.error) {
    serverError("Failed to load van details. Please try again later.");
  }
  if (!result.data) {
    notFound("Van not found");
  }
  return data(
    {
      cursor,
      excludeInRepair,
      limit,
      onlyOnSale,
      search,
      seo: buildVanDetailPageSeo(request, result.data),
      types,
      van: result.data,
    },
    { headers: PUBLIC_SHORT_CACHE_HEADERS }
  );
};

const VanDetailPage = ({ loaderData }: Route.ComponentProps) => {
  const {
    van,
    cursor,
    limit,
    search,
    types,
    excludeInRepair,
    onlyOnSale,
    seo,
  } = loaderData;

  // Build back link with pagination and filter search params
  const backLink = buildVanUrl({
    baseUrl: href("/vans"),
    cursor,
    excludeInRepair,
    limit,
    onlyOnSale,
    search,
    types,
  });

  // Determine back link message based on active filters
  const hasActiveFilters =
    (search && search.trim() !== "") ||
    (types && types.length > 0) ||
    excludeInRepair ||
    onlyOnSale;

  const backLinkMessage = hasActiveFilters ? "filtered" : "all";

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
      <SeoHead {...seo} />
      <CustomLink className={css({ gridArea: "back" })} to={backLink}>
        &larr; Back to{" "}
        <span className={css({ textTransform: "uppercase" })}>
          {backLinkMessage}
        </span>{" "}
        Vans
      </CustomLink>

      <div className={css({ alignSelf: "center", gridArea: "detail" })}>
        <VanDetail van={van} />
      </div>
    </div>
  );
};
export default VanDetailPage;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary
    error={error}
    errorFallback="This van could not be found."
  />
);
