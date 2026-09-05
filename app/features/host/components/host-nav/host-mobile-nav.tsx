import { ChevronDown } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useLocation } from "react-router";
import { ItemList } from "~/components/item-list";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "~/components/ui/popover";
import {
  formatRouteCount,
  getCurrentHostNavItem,
  hostNavGroups,
} from "../../constants/host-nav-groups";
import { hostNavItems } from "../../constants/host-nav-items";
import type { HostNavGroup } from "../../constants/host-nav-types";
import { HostNavLink } from "./host-nav-link";
import { HostNavMobileGroup } from "./host-nav-mobile-group";
import {
  hostNavMobileBarClassName,
  hostNavMobileClassName,
  hostNavMobilePopoverClassName,
  hostNavMobilePopoverCountClassName,
  hostNavMobileTriggerClassName,
  hostNavMobileTriggerIconClassName,
} from "./styles";

const HOST_MOBILE_POPOVER_ID = "host-mobile-nav-popover";
const HOST_MOBILE_POPOVER_TITLE_ID = "host-mobile-nav-popover-title";

type NativePopoverElement = HTMLElement & {
  hidePopover: () => void;
};

const closeHostNavPopover = () => {
  const popover = document.getElementById(HOST_MOBILE_POPOVER_ID);

  if (popover instanceof HTMLElement && "hidePopover" in popover) {
    (popover as NativePopoverElement).hidePopover();
  }
};

const handleHostNavLinkClick: MouseEventHandler<HTMLAnchorElement> = () => {
  closeHostNavPopover();
};

const renderHostNavMobileGroupProps = (group: HostNavGroup) => ({
  groupId: group.id,
  headingIdPrefix: "mobile-popover",
  onLinkClick: handleHostNavLinkClick,
});

const HostMobileNav = () => {
  const { pathname } = useLocation();
  const currentItem = getCurrentHostNavItem(pathname) ?? hostNavItems[0];

  return (
    <nav aria-label="Host navigation" className={hostNavMobileClassName}>
      <div className={hostNavMobileBarClassName}>
        <HostNavLink item={currentItem} />
        <button
          aria-controls={HOST_MOBILE_POPOVER_ID}
          className={hostNavMobileTriggerClassName}
          command="toggle-popover"
          commandfor={HOST_MOBILE_POPOVER_ID}
          type="button"
        >
          <span>Browse sections</span>
          <ChevronDown
            aria-hidden="true"
            className={hostNavMobileTriggerIconClassName}
            focusable="false"
          />
        </button>
      </div>
      <Popover
        aria-labelledby={HOST_MOBILE_POPOVER_TITLE_ID}
        className={hostNavMobilePopoverClassName}
        id={HOST_MOBILE_POPOVER_ID}
        popover="auto"
      >
        <PopoverHeader>
          <PopoverTitle id={HOST_MOBILE_POPOVER_TITLE_ID}>
            Browse sections
          </PopoverTitle>
          <span className={hostNavMobilePopoverCountClassName}>
            {formatRouteCount(hostNavItems.length)}
          </span>
        </PopoverHeader>
        <PopoverContent>
          <nav aria-labelledby={HOST_MOBILE_POPOVER_TITLE_ID}>
            <ItemList
              Component={HostNavMobileGroup}
              items={hostNavGroups}
              renderProps={renderHostNavMobileGroupProps}
            />
          </nav>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export { HostMobileNav };
