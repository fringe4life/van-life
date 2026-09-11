import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { useState, ViewTransition } from "react";
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { RouteErrorBoundary } from "./components/route-error-boundary";
import "./app.css";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { themeTransition } from "~/navigation/components/theme-toggle-transition";
import {
  colorSchemeForTheme,
  htmlThemeClassName,
  THEME_TRANSITION_TYPE,
  THEME_VIEW_TRANSITION_NAME,
  ThemeChangeContext,
  type ThemeChoice,
  useHtmlThemeClass,
} from "~/theme/theme";
import { readStoredTheme } from "~/theme/theme-cookie.server";
import type { Children } from "./types";

const layoutGrid = grid({
  gap: "0",
  gridTemplateAreas: '". nav ." ". content ." "footer footer footer"',
  gridTemplateColumns: "{spacing.padding-inline} 1fr {spacing.padding-inline}",
  gridTemplateRows: "var(--header-height) 1fr var(--footer-height)",
});

const themeTransitionRootClassName = css({
  backgroundColor: "background",
  inlineSize: "full",
  minBlockSize: "100dvh",
});

const themeTransitionUpdate = {
  [THEME_TRANSITION_TYPE]: themeTransition,
  default: "none",
} as const;

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
  const theme = useHtmlThemeClass(
    themeChoice === "system" ? null : themeChoice
  );
  const colorScheme = colorSchemeForTheme(theme);

  return (
    <html
      className={cx(
        css({ backgroundColor: "background" }),
        htmlThemeClassName(theme)
      )}
      dir="ltr"
      lang="en"
      style={{ colorScheme }}
      suppressHydrationWarning={cookieTheme === null}
    >
      <head>
        <meta charSet="utf-8" />
        <link href="/camper-van.png" rel="icon" type="image/png" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={colorScheme} name="color-scheme" />
        <Links />
      </head>
      <body>
        <ThemeChangeContext value={setThemeChoice}>
          <ViewTransition
            default="none"
            name={THEME_VIEW_TRANSITION_NAME}
            update={themeTransitionUpdate}
          >
            <div
              className={themeTransitionRootClassName}
              data-theme={themeChoice}
            >
              <div
                className={cx(
                  layoutGrid,
                  css({
                    backgroundColor: "surface",
                    inlineSize: "full",
                    marginInline: "auto",
                    maxInlineSize: "shell",
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
