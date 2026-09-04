import type { MouseEvent } from "react";
import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, visuallyHidden } from "styled-system/patterns";
import { ItemList } from "~/components/item-list";
import { Dialog } from "~/components/ui/dialog";
import { CustomLink } from "../../../components/links/custom-link";
import {
  brandClassName,
  mobileNavButtonClassName,
  mobileNavDrawerClassName,
  mobileNavSectionClassName,
  mobileNavSectionListClassName,
} from "../styles";
import type { NavItem as NavItemType } from "../types";
import { HamburgerIcon } from "./hamburger-icon";
import { NavItem } from "./nav-item";

const MOBILE_NAV_DIALOG_ID = "mobile-nav-dialog";

interface MobileNavDialogProps {
  auth: readonly NavItemType[];
  pages: readonly NavItemType[];
}

const closeMobileNavDialog = () => {
  const dialog = document.getElementById(MOBILE_NAV_DIALOG_ID);

  if (dialog instanceof HTMLDialogElement) {
    dialog.close();
  }
};

const withDialogClose =
  (onClick?: (event: MouseEvent<HTMLAnchorElement>) => void) =>
  (event: MouseEvent<HTMLAnchorElement>) => {
    closeMobileNavDialog();
    onClick?.(event);
  };

const closeBrandLink = withDialogClose();

const renderMobileNavItemProps = (item: NavItemType) => {
  switch (item.type) {
    case "form":
      return { item };
    case "link":
      return {
        item: {
          ...item,
          props: {
            ...item.props,
            onClick: withDialogClose(item.props.onClick),
          },
        },
      };
    case "nav-link":
      return {
        item: {
          ...item,
          props: {
            ...item.props,
            onClick: withDialogClose(item.props.onClick),
          },
        },
      };
    default:
      throw new Error(`Invalid item type: ${item satisfies never}`);
  }
};

const mobileNavSectionHeading = css({
  color: "muted.foreground",
  fontSize: "sm",
  fontWeight: "bold",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

const MobileNavTrigger = () => (
  <button
    aria-controls={MOBILE_NAV_DIALOG_ID}
    aria-haspopup="dialog"
    aria-label="Open navigation menu"
    className={mobileNavButtonClassName}
    command="show-modal"
    commandfor={MOBILE_NAV_DIALOG_ID}
    type="button"
  >
    <HamburgerIcon size={24} />
  </button>
);

const MobileNavDialog = ({ auth, pages }: MobileNavDialogProps) => (
  <Dialog
    aria-labelledby="mobile-nav-title"
    className={cx(cq({ name: "mobile-nav" }), "group/mobile-nav")}
    id={MOBILE_NAV_DIALOG_ID}
    variant="fullscreen"
  >
    {/* The host stays fixed; only the drawer moves during open/close. */}
    <CustomLink
      className={cx(
        brandClassName,
        css({
          insetBlockStart: "var(--nav-control-inset-block)",
          insetInlineStart: "calc({spacing.padding-inline} + 1px)",
          position: "absolute",
          zIndex: 1,
        })
      )}
      onClick={closeBrandLink}
      to={href("/")}
    >
      #vanlife
    </CustomLink>
    <div className={mobileNavDrawerClassName}>
      <nav aria-label="Page navigation" className={mobileNavSectionClassName}>
        <h3 className={mobileNavSectionHeading}>Pages</h3>
        <ItemList
          as="ul"
          Component={NavItem}
          className={mobileNavSectionListClassName}
          items={pages}
          renderProps={renderMobileNavItemProps}
        />
      </nav>
      <nav
        aria-label="Account navigation"
        className={mobileNavSectionClassName}
      >
        <h3 className={mobileNavSectionHeading}>Account</h3>
        <ItemList
          as="ul"
          Component={NavItem}
          className={mobileNavSectionListClassName}
          items={auth}
          renderProps={renderMobileNavItemProps}
        />
      </nav>
    </div>
    {/* Brand link is first tabbable; autofocus lands keyboard on close instead. */}
    {/* react-doctor-disable-next-line react-doctor/no-autofocus */}
    <button
      aria-label="Close navigation menu"
      autoFocus
      className={cx(
        mobileNavButtonClassName,
        css({
          insetBlockStart: "var(--nav-control-inset-block)",
          insetInlineEnd: "calc({spacing.padding-inline} + 1px)",
          position: "absolute",
          zIndex: 1,
        })
      )}
      command="close"
      commandfor={MOBILE_NAV_DIALOG_ID}
      type="button"
    >
      <HamburgerIcon size={24} />
    </button>
    <h2 className={visuallyHidden()} id="mobile-nav-title">
      Navigation
    </h2>
  </Dialog>
);

export { MobileNavDialog, MobileNavTrigger };
