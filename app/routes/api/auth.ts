/** biome-ignore-all lint/suspicious/useAwait: handlers return promises */
import type { Route } from "./+types/auth";

/**
 * Workaround: `.server` module imported inside the handlers rather than at module
 * scope, because a static import survives React Router's client export removal and
 * then trips its `.server` resolver.
 *
 * @remarks
 * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
 * Drop when upstream ships a fix; re-verify this module returns 200. Full note:
 * `app/routes/host/rental-activity.tsx`.
 *
 * @see https://github.com/remix-run/react-router/issues/14997 — open
 * @see https://github.com/fringe4life/van-life/issues/402 — tracking
 */
const loader = async ({ request }: Route.LoaderArgs) => {
  const { getAuth } = await import("~/lib/auth.server");

  return getAuth().handler(request);
};

const action = async ({ request }: Route.ActionArgs) => {
  const { getAuth } = await import("~/lib/auth.server");

  return getAuth().handler(request);
};

export { action, loader };
