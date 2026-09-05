import { CustomLink } from "../../../components/links/custom-link";
import { CustomNavLink } from "../../../components/links/custom-nav-link";
import type { NavItem as NavItemData } from "../types";
import { SignOutForm } from "./sign-out-form";

interface NavItemComponentProps {
  item: NavItemData;
}

const NavItem = ({ item }: NavItemComponentProps) => {
  switch (item.type) {
    case "form":
      return (
        <li>
          <SignOutForm className={item.props.className}>
            {item.children}
          </SignOutForm>
        </li>
      );

    case "link":
      return (
        <li>
          <CustomLink {...item.props}>{item.children}</CustomLink>
        </li>
      );

    case "nav-link":
      return (
        <li>
          <CustomNavLink {...item.props}>{item.children}</CustomNavLink>
        </li>
      );
    default:
      throw new Error(`Invalid item type: ${item satisfies never}`);
  }
};

export { NavItem };
