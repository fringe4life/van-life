import { href } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import type { NavItem as NavItemType } from "../types";
import { getNavItems } from "../utils/get-nav-items";
import { CustomLink } from "./custom-link";
import { MobileNav } from "./mobile-nav";
import { NavItem } from "./nav-item";

const renderNavItemProps = (item: NavItemType) => ({ item });

interface NavProps {
  hasToken: boolean;
}

const Nav = ({ hasToken }: NavProps) => {
  const navItems = getNavItems(hasToken);

  return (
    <header className="col-start-2 row-start-1 flex items-center justify-between gap-3 py-9 sm:gap-6">
      <h1 className="font-black text-xl xs:text-2xl uppercase">
        <CustomLink to={href("/")}>#vanlife</CustomLink>
      </h1>
      {/* Desktop nav */}
      <nav className="hidden md:block">
        <GenericComponent
          as="ul"
          Component={NavItem}
          className="flex justify-end gap-3"
          emptyStateMessage="No nav items"
          errorStateMessage="Something went wrong"
          items={navItems}
          renderProps={renderNavItemProps}
        />
      </nav>
      <MobileNav items={navItems} />
    </header>
  );
};

export { Nav };
