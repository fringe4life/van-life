import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext, RouterContextProvider } from "react-router";
import { ServerRouter } from "react-router";
import { injectThemeBootstrapIntoStream } from "~/theme/theme-bootstrap.server";
import { readStoredTheme } from "~/theme/theme-cookie.server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider
) {
  let shellRendered = false;
  let statusCode = responseStatusCode;
  const userAgent = request.headers.get("user-agent");
  const [cookieTheme, body] = await Promise.all([
    readStoredTheme(request.headers.get("Cookie")),
    renderToReadableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onError(error: unknown) {
          statusCode = 500;
          // biome-ignore lint/suspicious/noUnnecessaryConditions: recommended by react router
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    ),
  ]);
  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  const html =
    cookieTheme === null ? injectThemeBootstrapIntoStream(body) : body;

  return new Response(html, {
    headers: responseHeaders,
    status: statusCode,
  });
}
