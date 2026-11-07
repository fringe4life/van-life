import type { MouseEventHandler, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { ChevronIcon } from "~/components/icons/chevron-icon";
import { ItemList } from "~/components/item-list";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "~/components/ui/popover";
import { closePopoverById } from "~/components/ui/popover/utils";
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

interface PopoverToggleEvent extends Event {
  newState: "closed" | "open";
}

const isPopoverToggleEvent = (event: Event): event is PopoverToggleEvent =>
  "newState" in event;

const handleHostNavLinkClick: MouseEventHandler<HTMLAnchorElement> = () =>
  closePopoverById(HOST_MOBILE_POPOVER_ID);

const renderHostNavMobileGroupProps = (group: HostNavGroup) => ({
  groupId: group.id,
  headingIdPrefix: "mobile-popover",
  onLinkClick: handleHostNavLinkClick,
});

const HostMobileNav = (): ReactElement => {
  const { pathname } = useLocation();
  const currentItem = getCurrentHostNavItem(pathname) ?? hostNavItems[0];
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  /*
   * `command` / `commandfor` toggle the panel but announce nothing, so the
   * trigger reports its own expanded state (#443). The panel's `toggle` event is
   * the only source that stays right however it closed — Escape, a click
   * outside, or a nav link closing it by id — where a click handler on the
   * button would know about the first case only.
   *
   * The glyph reads the same state through `[aria-expanded='true']` rather than
   * a second flag, so the arrow and the announced state cannot disagree.
   */
  useEffect(() => {
    const popover = popoverRef.current;

    if (!popover) {
      return;
    }

    const handleToggle = (event: Event) => {
      if (isPopoverToggleEvent(event)) {
        setIsSectionsOpen(event.newState === "open");
      }
    };

    popover.addEventListener("toggle", handleToggle);

    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  return (
    <nav aria-label="Account sections" className={hostNavMobileClassName}>
      <div className={hostNavMobileBarClassName}>
        <HostNavLink item={currentItem} />
        <button
          aria-controls={HOST_MOBILE_POPOVER_ID}
          aria-expanded={isSectionsOpen}
          className={hostNavMobileTriggerClassName}
          command="toggle-popover"
          commandfor={HOST_MOBILE_POPOVER_ID}
          type="button"
        >
          <span>Browse sections</span>
          <ChevronIcon
            className={hostNavMobileTriggerIconClassName}
            direction="down"
          />
        </button>
      </div>
      <Popover
        aria-labelledby={HOST_MOBILE_POPOVER_TITLE_ID}
        className={hostNavMobilePopoverClassName}
        id={HOST_MOBILE_POPOVER_ID}
        popover="auto"
        ref={popoverRef}
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
