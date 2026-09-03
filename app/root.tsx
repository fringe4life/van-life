import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { RouteErrorBoundary } from "./components/route-error-boundary";
import "./app.css";
import { css, cx } from "../styled-system/css";
import { grid } from "../styled-system/patterns";
import type { Children } from "./types";

const layoutGrid = grid({
  gap: "0",
  gridTemplateAreas: '". nav ." ". content ." "footer footer footer"',
  gridTemplateColumns: "{spacing.padding-inline} 1fr {spacing.padding-inline}",
  gridTemplateRows: "var(--header-height) 1fr var(--footer-height)",
});

export const Layout = ({ children }: Children) => (
  <html className={css({ backgroundColor: "background" })} dir="ltr" lang="en">
    <head>
      <meta charSet="utf-8" />
      <link href="/camper-van.png" rel="icon" type="image/png" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <Links />
    </head>
    <body>
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
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const App = () => (
  <NuqsAdapter>
    <Outlet />
  </NuqsAdapter>
);
export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary error={error} />
);
