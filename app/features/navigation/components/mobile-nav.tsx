import type { MouseEvent } from "react";
import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, visuallyHidden, vstack } from "styled-system/patterns";
import { GenericComponent } from "~/components/generic-component";
import { Dialog } from "~/components/ui/dialog";
import type { Items } from "~/features/pagination/types";
import { CustomLink } from "../../../components/links/custom-link";
import { brandClassName } from "../styles";
import type { NavItem as NavItemType } from "../types";
import { HamburgerIcon } from "./hamburger-icon";
import { NavItem } from "./nav-item";

const MOBILE_NAV_DIALOG_ID = "mobile-nav-dialog";

interface MobileNavProps extends Items<NavItemType> {}

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
  if (item.type === "link") {
    return {
      item: {
        ...item,
        props: { ...item.props, onClick: withDialogClose(item.props.onClick) },
      },
    };
  }

  return {
    item: {
      ...item,
      props: { ...item.props, onClick: withDialogClose(item.props.onClick) },
    },
  };
};

const mobileNavButton = css({
  _hover: {
    backgroundColor: "surface.muted",
  },
  cursor: "pointer",
  padding: "1",
  rounded: "md",
  transitionDuration: "normal",
  transitionProperty: "colors",
});

const mobileNavDrawer = css({
  _groupOpenMobileNav: {
    _starting: {
      opacity: "0",
      translate: "-100% 0",
    },
    opacity: "1",
    translate: "0 0",
  },
  alignItems: "center",
  backgroundColor: "accent",
  blockSize: "full",
  display: "flex",
  flexDirection: "column",
  inlineSize: "full",
  inset: "0",
  justifyContent: "center",
  opacity: "0",
  overflowY: "auto",
  position: "absolute",
  textAlign: "center",
  transitionDuration: "var(--duration-dialog)",
  transitionProperty: "translate,opacity",
  transitionTimingFunction: "glide",
  translate: "100% 0",
});

const MobileNav = ({ items }: MobileNavProps) => (
  <div className={cx("group/hamburger", css({ display: { md: "none" } }))}>
    <button
      aria-controls={MOBILE_NAV_DIALOG_ID}
      aria-haspopup="dialog"
      aria-label="Open navigation menu"
      className={mobileNavButton}
      command="show-modal"
      commandfor={MOBILE_NAV_DIALOG_ID}
      type="button"
    >
      <HamburgerIcon size={24} />
    </button>
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
            insetBlockStart: "9",
            insetInlineStart: "padding-inline",
            position: "absolute",
            zIndex: 1,
          })
        )}
        onClick={closeBrandLink}
        to={href("/")}
      >
        #vanlife
      </CustomLink>
      <div className={mobileNavDrawer}>
        <nav>
          <GenericComponent
            as="ul"
            Component={NavItem}
            className={vstack({ fontSize: "lg", gap: "6" })}
            emptyState={{ title: "No nav items" }}
            errorState={{ title: "Something went wrong" }}
            items={items}
            noMatchState={null}
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
          mobileNavButton,
          css({
            insetBlockStart: "9",
            insetInlineEnd: "padding-inline",
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
  </div>
);

export { MobileNav };
