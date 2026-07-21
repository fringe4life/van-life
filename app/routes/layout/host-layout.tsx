import { Outlet } from "react-router";
import { GenericComponent } from "~/components/generic-component";
// Host nav lives in features/host; layout zone intentionally excludes that domain
// feature so only this host shell may reach it.
// fallow-ignore-next-line boundary-violation
import { hostNavItems } from "~/features/host/constants/host-nav-items";
import { authMiddleware } from "~/features/middleware/functions/auth-middleware";
import {
  CustomNavLink,
  type CustomNavLinkProps,
} from "~/features/navigation/components/custom-nav-link";
import { navLinkClassName } from "~/features/navigation/utils/nav-link-class-name";
import type { Route } from "./+types/host-layout";

const renderHostNavItemProps = (item: CustomNavLinkProps) => ({
  ...item,
  className: navLinkClassName,
});

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

// Intentionally empty: forces a `.data` request on client navigations under `/host`
// so `authMiddleware` runs before child routes render. Without this loader, RR may
// skip server middleware when a target route has no loader of its own.
// See docs/react-router-audit.md and node_modules/react-router/docs/how-to/middleware.md
export const loader = () => null;

const HostLayout = () => (
  <>
    <meta content="noindex, nofollow" name="robots" />
    <div className="grid grid-cols-1 contain-content">
      <GenericComponent
        as="ul"
        Component={CustomNavLink}
        className="mask-scroll-hint scrollbar-none mb-5 grid auto-cols-max grid-flow-col grid-rows-1 items-center gap-3 overflow-x-auto overscroll-x-contain py-3"
        emptyStateMessage="No nav links"
        errorStateMessage="Something went wrong"
        items={hostNavItems}
        renderProps={renderHostNavItemProps}
      />
    </div>
    <Outlet />
  </>
);
export default HostLayout;
