import { data, href } from "react-router";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { dbContext } from "~/features/middleware/contexts/db";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { buildVanUrl } from "~/features/pagination/utils/build-search-params";
import { buildVanDetailPageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import VanDetail from "~/features/vans/components/van-detail";
import { loadVanBySlug } from "~/features/vans/services/van-detail.server";
import {
  loadPaginationParams,
  loadSearchParams,
  loadVanFiltersParams,
} from "~/lib/search-params.server";
import { getRouteErrorMessage } from "~/utils/get-route-error-message";
import { notFound } from "~/utils/not-found";
import { serverError } from "~/utils/server-error";
import type { Route } from "./+types/van-detail";

export const headers = forwardDataHeaders;

export const loader = async ({
  params,
  request,
  context,
}: Route.LoaderArgs) => {
  const db = context.get(dbContext);

  // Parse search parameters from URL to preserve pagination and filter state
  const { cursor, limit } = loadPaginationParams(request);
  const { search } = loadSearchParams(request);
  const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);

  const result = await loadVanBySlug(db, params.vanSlug);
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
    <div className="grid min-h-full grid-rows-[min-content_1fr]">
      <SeoHead {...seo} />
      <CustomLink to={backLink}>
        &larr; Back to <span className="uppercase">{backLinkMessage}</span> Vans
      </CustomLink>
      <div className="self-center">
        <VanDetail van={van} />
      </div>
    </div>
  );
};
export default VanDetailPage;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState
    isError
    message={getRouteErrorMessage(error, {
      errorFallback: "This van could not be found.",
    })}
  />
);
