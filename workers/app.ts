import '@varlock/cloudflare-integration/init';
import { createRequestHandler, RouterContextProvider } from 'react-router';
import { cloudflareContext } from '~/features/middleware/contexts/cloudflare';

declare global {
	interface CloudflareEnvironment extends Env {}
}

const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE
);

export default {
	fetch(request, env, ctx) {
		const loadContext = new RouterContextProvider();
		loadContext.set(cloudflareContext, { ctx, env });
		return requestHandler(request, loadContext);
	},
} satisfies ExportedHandler<CloudflareEnvironment>;
