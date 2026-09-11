import type { NativePopoverElement } from "./types";

const closePopoverById = (id: string) => {
  const popover = document.getElementById(id);
  if (popover instanceof HTMLElement && "hidePopover" in popover) {
    (popover as NativePopoverElement).hidePopover();
  }
};

const closeClosestPopover = (element: EventTarget | null) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const popover = element.closest<HTMLElement>("[popover]");
  if (popover instanceof HTMLElement && "hidePopover" in popover) {
    (popover as NativePopoverElement).hidePopover();
  }
};

export { closeClosestPopover, closePopoverById };
