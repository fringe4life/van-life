import { auth } from '~/lib/auth.server';
import type { Route } from './+types/auth';

// biome-ignore lint/suspicious/useAwait: auth.handler returns a Promise
export async function loader({ request }: Route.LoaderArgs) {
	return auth.handler(request);
}

// biome-ignore lint/suspicious/useAwait: auth.handler returns a Promise
export async function action({ request }: Route.ActionArgs) {
	return auth.handler(request);
}
