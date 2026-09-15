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

const navShellScroll = keyframes({
  from: {
    backgroundColor: "surface",
    blockSize: "var(--header-height)",
    borderBlockStartColor: "transparent",
    borderBottomColor: "transparent",
    borderInlineColor: "transparent",
    borderRadius: "0",
    boxShadow: "none",
    paddingBlock: "7",
    translate: "0 0",
  },
  to: {
    backgroundColor: "card",
    blockSize: "var(--nav-shell-compact-height)",
    borderBlockStartColor: "border",
    borderBottomColor: "border.accent",
    borderInlineColor: "border",
    borderRadius: "full",
    boxShadow: "sm",
    paddingBlock: "2",
    translate: "0 var(--nav-shell-scroll-offset)",
  },
});

const scrollAnimation = css({
  _supportsScroll: {
    animationName: navShellScroll,
    animationRange: "0 token(nav-shell-scroll-range)",
    animationTimeline: "scroll()",
    animationTimingFunction: "glide",
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
