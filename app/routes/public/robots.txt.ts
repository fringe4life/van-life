import { generateRobotsTxt } from "@forge42/seo-tools/robots";
import { href } from "react-router";
import { env } from "~/lib/env.server";
import { getSiteOrigin } from "~/seo/get-site-origin.server";
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
            disallow: [
              "/host/",
              "/login",
              "/signup",
              "/signout",
              "/theme",
              "/api/",
            ],
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
