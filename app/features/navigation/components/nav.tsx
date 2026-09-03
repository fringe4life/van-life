import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { GenericComponent } from "~/components/generic-component";
import { CustomLink } from "../../../components/links/custom-link";
import { brandClassName } from "../styles";
import type { NavItem as NavItemType } from "../types";
import { getNavItems } from "../utils/get-nav-items";
import { MobileNav } from "./mobile-nav";
import { NavItem } from "./nav-item";

const renderNavItemProps = (item: NavItemType) => ({ item });

interface NavProps {
  hasToken: boolean;
}

const Nav = ({ hasToken }: NavProps) => {
  const navItems = getNavItems(hasToken);

  return (
    <header
      className={cx(
        css({ gridArea: "nav" }),
        hstack({
          gap: { base: "3", sm: "6" },
          justifyContent: "space-between",
          paddingBlock: "9",
        })
      )}
    >
      <h1 className={brandClassName}>
        <CustomLink to={href("/")}>#vanlife</CustomLink>
      </h1>
      {/* Desktop nav */}
      <nav className={css({ display: { base: "none", md: "block" } })}>
        <GenericComponent
          as="ul"
          Component={NavItem}
          className={hstack({ gap: "3", justifyContent: "end" })}
          emptyState={{ title: "No nav items" }}
          errorState={{ title: "Something went wrong" }}
          items={navItems}
          noMatchState={null}
          renderProps={renderNavItemProps}
        />
      </nav>
      <MobileNav items={navItems} />
    </header>
  );
};

export { Nav };
