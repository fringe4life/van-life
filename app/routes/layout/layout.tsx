import { data, Outlet } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { hasAuthContext } from "~/features/middleware/contexts/has-auth";
import { hasAuthMiddleware } from "~/features/middleware/functions/has-auth-middleware";
import { Nav } from "~/features/navigation/components/nav";
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

      <footer
        className={cx(
          grid({
            gap: "0",
            placeContent: "center",
          }),
          css({
            backgroundColor: "surface.inverse",
            contain: "strict",
            gridArea: "footer",
            paddingBlock: "6",
          })
        )}
      >
        {/* react-doctor-disable-next-line
				react-doctor/rendering-hydration-mismatch-time */}
        <p
          className={css({
            color: "surface.inverse.foreground",
            fontSize: "sm",
            textAlign: "center",
            textTransform: "uppercase",
          })}
          suppressHydrationWarning
        >
          &copy;{new Date().getFullYear()} #vanlife
        </p>
        <a
          className={css({
            color: "surface.inverse.foreground",
            display: "inline-block",
            fontSize: { base: "2xs", xs: "xs" },
            inlineSize: "full",
            textAlign: "center",
            wordBreak: "break-word",
          })}
          href="https://www.flaticon.com/free-icons/camper-van"
          title="camper van icons"
        >
          Camper van icons created by Iconfromus - Flaticon
        </a>
      </footer>
    </>
  );
};
export default Layout;
