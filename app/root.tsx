import interLatinHref from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { useState, ViewTransition } from "react";
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { themeTransition } from "~/navigation/components/theme-toggle-transition";
import type { ThemeChoice } from "~/theme/schema";
import {
  htmlThemeAttribute,
  THEME_TRANSITION_TYPE,
  THEME_VIEW_TRANSITION_NAME,
  ThemeChangeContext,
} from "~/theme/theme";
import { readStoredTheme } from "~/theme/theme-cookie.server";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { RouteErrorBoundary } from "./components/route-error-boundary";
import type { Children } from "./types";

const layoutGrid = grid({
  gap: "0",
  gridTemplateAreas: '". nav ." ". content ." "footer footer footer"',
  gridTemplateColumns:
    "minmax({spacing.padding-inline}, 1fr) minmax(0, {sizes.shell}) minmax({spacing.padding-inline}, 1fr)",
  gridTemplateRows: "var(--header-height) 1fr var(--footer-height)",
});

const themeTransitionRootClassName = css({
  inlineSize: "full",
  minBlockSize: "100dvh",
});

const themeTransitionUpdate = {
  [THEME_TRANSITION_TYPE]: themeTransition,
  default: "none",
} as const;

export const links: Route.LinksFunction = () => [
  {
    as: "font",
    crossOrigin: "anonymous",
    href: interLatinHref,
    rel: "preload",
    type: "font/woff2",
  },
  { href: stylesheet, rel: "stylesheet" },
];

export async function loader({ request }: Route.LoaderArgs) {
  return {
    theme: await readStoredTheme(request.headers.get("Cookie")),
  };
}

export const Layout = ({ children }: Children) => {
  const loaderData = useRouteLoaderData("root") as
    | Route.ComponentProps["loaderData"]
    | undefined;
  const cookieTheme = loaderData?.theme ?? null;
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>(
    cookieTheme ?? "system"
  );
  const themeAttribute = htmlThemeAttribute(themeChoice);

  return (
    <html data-theme={themeAttribute} dir="ltr" lang="en">
      <head>
        <meta charSet="utf-8" />
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="light dark" name="color-scheme" />
        <Links />
      </head>
      <body>
        <ThemeChangeContext value={setThemeChoice}>
          <ViewTransition
            default="none"
            name={THEME_VIEW_TRANSITION_NAME}
            update={themeTransitionUpdate}
          >
            {/* Same data-theme as <html> so the ViewTransition sees an inner mutation. */}
            <div
              className={themeTransitionRootClassName}
              data-theme={themeAttribute}
            >
              <div
                className={cx(
                  layoutGrid,
                  css({
                    backgroundColor: "surface",
                    inlineSize: "full",
                    minBlockSize: "100dvh",
                  })
                )}
              >
                {children}
              </div>
            </div>
          </ViewTransition>
        </ThemeChangeContext>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const App = () => (
  <NuqsAdapter>
    <Outlet />
  </NuqsAdapter>
);
export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary error={error} />
);
