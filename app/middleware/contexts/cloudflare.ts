import { createContext } from "react-router";

interface CloudflareLoadContext {
  ctx: ExecutionContext;
  env: Env;
}

export const cloudflareContext = createContext<CloudflareLoadContext>();
