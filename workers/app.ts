// Must be first: Workers ban `new Function`; ArkType JIT must be jitless before any `type()`.
import "~/lib/arktype.config";
import { createRequestHandler, RouterContextProvider } from "react-router";
import { createDb } from "~/db/client.server";
import { cloudflareContext } from "~/features/middleware/contexts/cloudflare";
import { dbContext } from "~/features/middleware/contexts/db";

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
    const db = createDb(env.DB);
    loadContext.set(cloudflareContext, { ctx, env });
    loadContext.set(dbContext, db);
    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
