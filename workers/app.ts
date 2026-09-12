import { createRequestHandler, RouterContextProvider } from "react-router";
import { getDb } from "~/db/get-db.server";
import { cloudflareContext } from "~/middleware/contexts/cloudflare";
import { dbContext } from "~/middleware/contexts/db";

declare global {
  interface CloudflareEnvironment extends Env {}
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  fetch(request, env, ctx) {
    const loadContext = new RouterContextProvider();
    loadContext.set(cloudflareContext, { ctx, env });
    loadContext.set(dbContext, getDb());
    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
