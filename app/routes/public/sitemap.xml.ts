import { generateSitemap } from "@forge42/seo-tools/sitemap";
import { href } from "react-router";
import { dbContext } from "~/features/middleware/contexts/db";
import { getVanSlugsForSitemap } from "~/features/seo/dal/sitemap.server";
import { getSiteOrigin } from "~/features/seo/get-site-origin.server";
import type { Route } from "./+types/sitemap.xml";

const formatLastMod = (date: Date) => date.toISOString().split("T")[0];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
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
