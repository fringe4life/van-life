/** biome-ignore-all lint/suspicious/useAwait: handlers return promises */
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/auth';

const loader = async ({ request }: Route.LoaderArgs) => auth.handler(request);

const action = async ({ request }: Route.ActionArgs) => auth.handler(request);

export { loader, action };
