import { Outlet } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
//fallow-ignore-next-line boundary-violation
import { HostMobileNav } from "~/features/host/components/host-nav/host-mobile-nav";
//fallow-ignore-next-line boundary-violation
import { HostNav } from "~/features/host/components/host-nav/host-nav";
import { authMiddleware } from "~/features/middleware/functions/auth-middleware";
import type { Route } from "./+types/host-layout";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

// Intentionally empty: forces a `.data` request on client navigations under `/host`
// so `authMiddleware` runs before child routes render. Without this loader, RR may
// skip server middleware when a target route has no loader of its own.
// See docs/react-router-audit.md and node_modules/react-router/docs/how-to/middleware.md
export const loader = () => null;

const HostLayout = () => (
  <>
    <meta content="noindex, nofollow" name="robots" />

    <div
      className={grid({
        alignItems: "start",
        contain: "content",
        gap: { base: "6", lg: "8" },
        gridTemplateAreas: { base: '"nav" "content"', lg: '"nav content"' },
        gridTemplateColumns: { base: "1fr", lg: "15rem minmax(0,1fr)" },
      })}
    >
      <aside
        className={cx(
          grid({
            alignSelf: { lg: "start" },
            contain: "content",
            gap: "6",
            gridTemplateColumns: "1fr",
          }),
          css({
            gridArea: "nav",
            insetBlockStart: { lg: "var(--header-height)" },
            maxBlockSize: { lg: "calc(100dvh - var(--header-height))" },
            minInlineSize: "0",
            overflowY: { lg: "auto" },
            position: { lg: "sticky" },
          })
        )}
      >
        <HostMobileNav />
        <HostNav />
      </aside>

      <div className={css({ gridArea: "content", minInlineSize: "0" })}>
        <Outlet />
      </div>
    </div>
  </>
);
export default HostLayout;
