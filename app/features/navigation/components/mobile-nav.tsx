import type { MouseEvent } from "react";
import { GenericComponent } from "~/components/generic-component";
import { Dialog } from "~/components/ui/dialog";
import type { Items } from "~/features/pagination/types";
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

const MobileNav = ({ items }: MobileNavProps) => (
  <div className="group/hamburger mobile-nav md:hidden">
    <button
      aria-label="Open navigation menu"
      className="cursor-pointer rounded p-1 transition-colors duration-250 hover:bg-surface-muted"
      command="show-modal"
      commandfor={MOBILE_NAV_DIALOG_ID}
      type="button"
    >
      <HamburgerIcon size={24} />
    </button>
    <Dialog
      aria-labelledby="mobile-nav-title"
      className="@container/mobile-nav group/mobile-nav flex-col items-center justify-center open:flex"
      id={MOBILE_NAV_DIALOG_ID}
      variant="fullscreen"
    >
      <button
        aria-label="Close navigation menu"
        className="absolute top-9 right-(--padding-inline) translate-x-[-100cqi] cursor-pointer rounded p-1 transition-[translate,color,background-color] duration-(--duration-dialog) ease-glide hover:bg-surface-muted group-open/mobile-nav:starting:translate-x-[-100cqi] group-open/mobile-nav:translate-x-0"
        command="close"
        commandfor={MOBILE_NAV_DIALOG_ID}
        type="button"
      >
        <HamburgerIcon size={24} />
      </button>
      <h2 className="sr-only" id="mobile-nav-title">
        Navigation
      </h2>
      <nav>
        <GenericComponent
          as="ul"
          Component={NavItem}
          className="flex flex-col items-center gap-6 text-lg"
          emptyStateMessage="No nav items"
          errorStateMessage="Something went wrong"
          items={items}
          renderProps={renderMobileNavItemProps}
        />
      </nav>
    </Dialog>
  </div>
);

export { MobileNav };
