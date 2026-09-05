import { href } from "react-router";
import { cx } from "styled-system/css";
import { ItemList } from "~/components/item-list";
import { CustomLink } from "../../../components/links/custom-link";
import {
  brandClassName,
  desktopAuthNavClassName,
  desktopNavListClassName,
  desktopPageNavClassName,
  navBrandClassName,
  navOuterClassName,
  navShellClassName,
} from "../styles";
import type { NavItem as NavItemType } from "../types";
import { getAuthNavItems, pageNavItems } from "../utils/get-nav-items";
import { MobileNavDialog, MobileNavTrigger } from "./mobile-nav";
import { NavItem } from "./nav-item";

const renderNavItemProps = (item: NavItemType) => ({ item });

interface NavProps {
  hasToken: boolean;
}

const Nav = ({ hasToken }: NavProps) => {
  const auth = getAuthNavItems(hasToken);

  return (
    <header className={cx(navOuterClassName, "group/hamburger")}>
      <div className={cx(navShellClassName, "nav-shell-scroll")}>
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

        {/* Desktop account navigation */}
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

      <MobileNavDialog auth={auth} />
    </header>
  );
};

export { Nav };
