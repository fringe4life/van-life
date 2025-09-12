import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { auth } from '~/lib/auth.server';

// biome-ignore lint/suspicious/useAwait: auth.handler returns a Promise
export async function loader({ request }: LoaderFunctionArgs) {
	return auth.handler(request);
}

// biome-ignore lint/suspicious/useAwait: auth.handler returns a Promise
export async function action({ request }: ActionFunctionArgs) {
	return auth.handler(request);
}
