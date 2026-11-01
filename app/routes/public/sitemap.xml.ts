import { generateSitemap } from "@forge42/seo-tools/sitemap";
import { href } from "react-router";
import { dbContext } from "~/middleware/contexts/db";
import type { Route } from "./+types/sitemap.xml";

const formatLastMod = (date: Date) => date.toISOString().split("T")[0];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  /**
   * Workaround: `.server` modules imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200. Full note:
   * `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [{ getVanSlugsForSitemap }, { getSiteOrigin }] = await Promise.all([
    import("~/seo/dal/sitemap.server"),
    import("~/seo/get-site-origin.server"),
  ]);

  const origin = getSiteOrigin(request);
  const db = context.get(dbContext);
  const vans = await getVanSlugsForSitemap(db);

  const sitemap = await generateSitemap({
    domain: origin,
    routes: [
      {
        changefreq: "weekly",
        priority: 1,
        url: href("/"),
      },
      {
        changefreq: "monthly",
        priority: 0.8,
        url: href("/about"),
      },
      {
        changefreq: "daily",
        priority: 0.9,
        url: href("/vans"),
      },
      ...vans.map((van) => ({
        changefreq: "weekly" as const,
        lastmod: formatLastMod(van.createdAt),
        priority: 0.7 as const,
        url: href("/vans/:vanSlug", { vanSlug: van.slug }),
      })),
    ],
  });

  return new Response(sitemap, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml",
    },
  });
};
