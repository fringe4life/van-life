import { ViewTransition } from "react";
import { href } from "react-router";
import { css, cx, keyframes } from "styled-system/css";
import { ItemList } from "~/components/item-list";
import { CustomLink } from "~/components/links/custom-link";
import {
  brandClassName,
  desktopAuthNavClassName,
  desktopNavListClassName,
  desktopPageNavClassName,
  navBrandClassName,
  navEndClusterClassName,
  navOuterClassName,
  navShellClassName,
} from "../styles";
import type { NavItem as NavItemType } from "../types";
import { getAuthNavItems, pageNavItems } from "../utils/get-nav-items";
import { MobileNavDialog, MobileNavTrigger } from "./mobile-nav";
import { NavItem } from "./nav-item";
import { ThemeToggle } from "./theme-toggle";

const renderNavItemProps = (item: NavItemType) => ({ item });

interface NavProps {
  hasToken: boolean;
}

// Layout-only keyframes. Animating `background-color` / border colors bakes the
// used `light-dark()` value into the scroll timeline, so theme toggles leave the
// chrome stuck on the old scheme while non-animated text updates.
const navShellScrollLayout = keyframes({
  from: {
    blockSize: "var(--header-height)",
    borderRadius: "0",
    boxShadow: "none",
    paddingBlock: "7",
    translate: "0 0",
  },
  to: {
    blockSize: "var(--nav-shell-compact-height)",
    borderRadius: "full",
    boxShadow: "sm",
    paddingBlock: "2",
    translate: "0 var(--nav-shell-scroll-offset)",
  },
});

const navShellScrollChrome = keyframes({
  from: { opacity: "0" },
  to: { opacity: "1" },
});

const scrollTimeline = {
  // Keep end keyframes after the range so the pill does not snap back to the
  // full header once scroll passes `--nav-shell-scroll-range`.
  animationFillMode: "both",
  animationRange: "0 var(--nav-shell-scroll-range)",
  animationTimeline: "scroll()",
  animationTimingFunction: "glide",
} as const;

const scrollAnimation = css({
  _supportsScroll: {
    ...scrollTimeline,
    _before: {
      ...scrollTimeline,
      animationName: navShellScrollChrome,
      backgroundColor: "card",
      borderBlockStartColor: "border",
      borderBottomColor: "border.accent",
      borderInlineColor: "border",
      borderRadius: "inherit",
      borderStyle: "solid",
      borderWidth: "1px",
      content: '""',
      inset: "0",
      opacity: "0",
      pointerEvents: "none",
      position: "absolute",
      zIndex: -1,
    },
    animationName: navShellScrollLayout,
  },
});

const Nav = ({ hasToken }: NavProps) => {
  const auth = getAuthNavItems(hasToken);

  return (
    <ViewTransition name="nav">
      <header className={cx(navOuterClassName, "group/hamburger")}>
        <div className={cx(navShellClassName, scrollAnimation)}>
          <h1 className={cx(brandClassName, navBrandClassName)}>
            <CustomLink to={href("/")}>#vanlife</CustomLink>
          </h1>

          {/* Desktop page navigation */}
          <nav aria-label="Page navigation" className={desktopPageNavClassName}>
            <ItemList
              as="ul"
              Component={NavItem}
              className={desktopNavListClassName}
              items={pageNavItems}
              renderProps={renderNavItemProps}
            />
          </nav>

          <div className={navEndClusterClassName}>
            <ThemeToggle />
            <nav
              aria-label="Account navigation"
              className={desktopAuthNavClassName}
            >
              <ItemList
                as="ul"
                Component={NavItem}
                className={desktopNavListClassName}
                items={auth}
                renderProps={renderNavItemProps}
              />
            </nav>
            <MobileNavTrigger />
          </div>
        </div>

        <MobileNavDialog auth={auth} />
      </header>
    </ViewTransition>
  );
};

export { Nav };
