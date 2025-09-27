/** biome-ignore-all lint/style/noMagicNumbers: React Router server entry point with standard timeouts */
/** biome-ignore-all lint/suspicious/noConsole: Server-side error logging is appropriate */

import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable } from '@react-router/node';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { RouterContextProvider, ServerRouter } from 'react-router';

export const streamTimeout = 5000;

export function getLoadContext() {
	const context = new RouterContextProvider();
	return context;
}

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: a server file i dont understand to well
	loadContext: RouterContextProvider
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const userAgent = request.headers.get('user-agent');

		// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
		// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
		const readyOption: keyof RenderToPipeableStreamOptions =
			(userAgent && isbot(userAgent)) || routerContext.isSpaMode
				? 'onAllReady'
				: 'onShellReady';

		// Abort the rendering stream after the `streamTimeout` so it has time to
		// flush down the rejected boundaries
		let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
			() => abort(),
			streamTimeout + 1000
		);

		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={routerContext} url={request.url} />,
			{
				[readyOption]() {
					shellRendered = true;
					const body = new PassThrough({
						final(callback) {
							// Clear the timeout to prevent retaining the closure and memory leak
							clearTimeout(timeoutId);
							timeoutId = undefined;
							callback();
						},
					});
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set('Content-Type', 'text/html');

					pipe(body);

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						})
					);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					// biome-ignore lint/style/noParameterAssign: a server file i dont understand to well
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					// biome-ignore lint/nursery/noUnnecessaryConditions: Standard React Router pattern
					if (shellRendered) {
						console.error(error);
					}
				},
			}
		);
	});
}
