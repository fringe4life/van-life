import { ViewTransition } from "react";
import { data, Outlet } from "react-router";
import { css } from "styled-system/css";
import { SiteFooter } from "~/footer/components/site-footer";
import { hasAuthContext } from "~/middleware/contexts/has-auth";
import { hasAuthMiddleware } from "~/middleware/functions/has-auth-middleware";
import { Nav } from "~/navigation/components/nav";
import type { Route } from "./+types/layout";
export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const hasAuth = context.get(hasAuthContext);
  return data(hasAuth);
}

const Layout = ({ loaderData }: Route.ComponentProps) => {
  const hasToken = loaderData;
  return (
    <>
      <Nav hasToken={hasToken} />

      <main
        className={css({
          gridArea: "content",
          marginBlockEnd: "6",
        })}
      >
        <Outlet />
      </main>
      {/*
       * No `contain: strict` here: the footer sizes itself from its content now,
       * and size containment would collapse it to nothing.
       */}
      <ViewTransition name="footer">
        <SiteFooter hasToken={hasToken} />
      </ViewTransition>
    </>
  );
};
export default Layout;
