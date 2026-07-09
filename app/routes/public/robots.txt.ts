import { generateRobotsTxt } from "@forge42/seo-tools/robots";
import { href } from "react-router";
import { getSiteOrigin } from "~/features/seo/get-site-origin.server";
import { env } from "~/lib/env.server";
import type { Route } from "./+types/robots.txt";

export const loader = ({ request }: Route.LoaderArgs) => {
  const isProduction = env.VARLOCK_ENV === "production";
  const origin = getSiteOrigin(request);

  const robotsTxt = generateRobotsTxt([
    {
      userAgent: "*",
      ...(isProduction
        ? {
            allow: ["/"],
            disallow: ["/host/", "/login", "/signup", "/signout", "/api/"],
          }
        : { disallow: ["/"] }),
      sitemap: [`${origin}${href("/sitemap.xml")}`],
    },
  ]);

  return new Response(robotsTxt, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain",
    },
  });
};
