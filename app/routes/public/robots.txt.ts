import { generateRobotsTxt } from "@forge42/seo-tools/robots";
import { href } from "react-router";
import type { Route } from "./+types/robots.txt";

export const loader = async ({ request }: Route.LoaderArgs) => {
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
  const [{ env }, { getSiteOrigin }] = await Promise.all([
    import("~/lib/env.server"),
    import("~/seo/get-site-origin.server"),
  ]);

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
