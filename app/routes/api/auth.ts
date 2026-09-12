/** biome-ignore-all lint/suspicious/useAwait: handlers return promises */
import { getAuth } from "~/lib/auth.server";
import type { Route } from "./+types/auth";

const loader = async ({ request }: Route.LoaderArgs) =>
  getAuth().handler(request);

const action = async ({ request }: Route.ActionArgs) =>
  getAuth().handler(request);

export { action, loader };
