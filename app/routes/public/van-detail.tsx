import { data, href } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import VanDetail from "~/features/vans/components/van-detail";
import { dbContext } from "~/middleware/contexts/db";
import { buildVanUrl } from "~/pagination/utils/build-search-params";
import { SeoHead } from "~/seo/seo-head";
import { notFound } from "~/utils/errors/not-found";
import { serverError } from "~/utils/errors/server-error";
import type { Route } from "./+types/van-detail";

export const headers = forwardDataHeaders;

export const loader = async ({
  params,
  request,
  context,
}: Route.LoaderArgs) => {
  /**
   * Workaround: `.server` modules imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver, so the route's client bundle never loads.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200 and the page
   * hydrates. Full note: `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [
    { loadVansSearchParams },
    { buildVanDetailPageSeo },
    { loadVanBySlug },
  ] = await Promise.all([
    import("~/features/vans/loaders.server"),
    import("~/features/vans/seo.server"),
    import("~/features/vans/services/van-detail.server"),
  ]);

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
