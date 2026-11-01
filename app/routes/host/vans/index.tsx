import { data, href, Outlet, useLocation } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { VanDetailCard } from "~/features/vans/components/host-detail";
import { getHostVanDetailNavItems } from "~/features/vans/components/host-detail/get-host-van-detail-nav-items";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { withSearch } from "~/pagination/utils/with-search";
import { notFound } from "~/utils/errors/not-found";
import type { Route } from "./+types/index";

export const headers = forwardDataHeaders;

export const loader = async ({ params, context }: Route.LoaderArgs) => {
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
  const [{ getHostVanBySlug }, { tryCatch }] = await Promise.all([
    import("~/features/vans/dal/host-van.server"),
    import("~/utils/errors/try-catch.server"),
  ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);

  const { data: van } = await tryCatch(() =>
    getHostVanBySlug(db, user.id, params.vanSlug)
  );

  if (!van) {
    notFound("Van not found");
  }

  return data({ van }, { headers: PRIVATE_NO_STORE_HEADERS });
};

const HostVanDetailLayout = ({ loaderData }: Route.ComponentProps) => {
  const { van } = loaderData;
  const { search } = useLocation();
  const navItems = getHostVanDetailNavItems(van.slug, search);
  const backLink = withSearch(href("/host/vans"), search);

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
        <VanDetailCard navItems={navItems} van={van}>
          <Outlet />
        </VanDetailCard>
      </div>
    </div>
  );
};
export default HostVanDetailLayout;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary
    error={error}
    errorFallback="This van could not be found."
  />
);
