import { Outlet } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import {
  CustomNavLink,
  type CustomNavLinkProps,
} from "~/components/links/custom-nav-link";
// Host nav lives in features/host; layout zone intentionally excludes that domain
// feature so only this host shell may reach it.
// fallow-ignore-next-line boundary-violation
import { hostNavItems } from "~/features/host/constants/host-nav-items";
import { authMiddleware } from "~/features/middleware/functions/auth-middleware";
import { navLinkClassName } from "~/features/navigation/styles";
import { css, cx } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";
import type { Route } from "./+types/host-layout";

const renderHostNavItemProps = (item: CustomNavLinkProps) => ({
  ...item,
  className: navLinkClassName,
});

const HostNavListItem = (props: CustomNavLinkProps) => (
  <li>
    <CustomNavLink {...props} />
  </li>
);

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

// Intentionally empty: forces a `.data` request on client navigations under `/host`
// so `authMiddleware` runs before child routes render. Without this loader, RR may
// skip server middleware when a target route has no loader of its own.
// See docs/react-router-audit.md and node_modules/react-router/docs/how-to/middleware.md
export const loader = () => null;

const maskScrollHint = css({
  _supportsScroll: {
    animationDuration: "auto",
    animationName: "scroll-mask",
    animationTimeline: "scroll(x self)",
    animationTimingFunction: "linear",
  },
  maskImage:
    "linear-gradient(to right, black 0%, black 5%, black 95%, transparent 100%)",
  maskRepeat: "no-repeat",
});

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
            insetBlockStart: "6",
            maxBlockSize: "calc(100dvh - 3rem)",
            minInlineSize: "0",
            overflowY: { lg: "auto" },
            position: { lg: "sticky" },
          })
        )}
      >
        <nav
          aria-label="Host navigation"
          className={css({ minInlineSize: "0" })}
        >
          <GenericComponent
            as="ul"
            Component={HostNavListItem}
            className={cx(
              grid({
                alignItems: "center",
                columns: { lg: 1 },
                gap: { base: "3", lg: "2" },
                gridAutoColumns: { base: "max-content", lg: "auto" },
                gridAutoFlow: { base: "column", lg: "row" },
              }),
              css({
                lg: {
                  animation: "none",
                  maskImage: "none",
                },
                marginBlockEnd: { base: "5", lg: "0" },
                minInlineSize: "0",
                overflowX: { base: "auto", lg: "visible" },
                overscrollBehaviorX: { base: "contain", lg: "auto" },
                paddingBlock: { base: "3", lg: "0" },
                scrollbarWidth: "none",
              }),
              maskScrollHint
            )}
            emptyState={{ title: "No nav links" }}
            errorState={{ title: "Something went wrong" }}
            items={hostNavItems}
            noMatchState={null}
            renderProps={renderHostNavItemProps}
          />
        </nav>
      </aside>

      <div className={css({ gridArea: "content", minInlineSize: "0" })}>
        <Outlet />
      </div>
    </div>
  </>
);
export default HostLayout;
