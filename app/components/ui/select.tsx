import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";
import { useSupportsBaseSelect } from "~/hooks/use-supports-base-select";

const fallbackChevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23161616' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const selectClassName = css({
  _disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
    pointerEvents: "none",
  },
  _focusVisible: {
    borderColor: "ring",
    focusRingColor: "ring",
    focusRingOffset: "0",
    focusRingWidth: "2px",
    focusVisibleRing: "outside",
  },
  _focusWithin: {
    borderColor: "ring",
  },
  _starting: {
    "&:open::picker(select)": {
      opacity: 0,
      translate: "0 -0.5rem",
    },
  },
  _supportsBaseSelect: {
    "& option": {
      _checked: {
        color: "primary",
        fontWeight: "bold",
      },
      _hover: {
        backgroundColor: "accent",
      },
      alignItems: "center",
      borderRadius: "md",
      display: "flex",
      gap: "2",
      paddingBlock: "2",
      paddingInline: "3",
      transitionDuration: "fast",
      transitionProperty: "background-color, color",
    },
    "& option::checkmark": {
      color: "ring",
    },
    "& selectedcontent": {
      alignItems: "center",
      display: "flex",
      gap: "2",
      overflow: "hidden",
    },
    alignItems: "center",
    appearance: "base-select",
    backgroundImage: "none",
    display: "flex",
    gap: "2",
    paddingInlineEnd: "4",
  },
  "&::picker-icon": {
    color: "muted.foreground",
    transitionDuration: "normal",
    transitionProperty: "rotate",
  },
  "&::picker(select)": {
    appearance: "base-select",
    backgroundColor: "popover",
    borderColor: "border",
    borderRadius: "lg",
    borderStyle: "solid",
    borderWidth: "1",
    boxShadow: "md",
    color: "popover.foreground",
    marginBlockStart: "1",
    minInlineSize: "anchor-size(self-inline)",
    opacity: 0,
    padding: "1",
    transitionBehavior: "allow-discrete",
    transitionDuration: "normal",
    transitionProperty: "opacity, translate, display, overlay",
    translate: "0 -0.5rem",
  },
  "&:open::picker-icon": {
    rotate: "180deg",
  },
  "&:open::picker(select)": {
    opacity: 1,
    translate: "0 0",
  },
  "&:user-invalid": {
    borderColor: "destructive",
  },
  "&[aria-invalid=true]": {
    borderColor: "destructive",
  },
  appearance: "none",
  backgroundColor: "card",
  backgroundImage: fallbackChevron,
  backgroundPosition: "right 0.75rem center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "1rem",
  blockSize: "9",
  borderColor: "input",
  borderRadius: "md",
  borderStyle: "solid",
  borderWidth: "1",
  boxShadow: "xs",
  color: "card.foreground",
  inlineSize: "full",
  paddingInlineEnd: "8",
  paddingInlineStart: "4",
  transitionDuration: "normal",
  transitionProperty: "colors",
});

function Select({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  const supportsBaseSelect = useSupportsBaseSelect();
  const pickerName = ariaLabelledBy ? undefined : (ariaLabel ?? "Select");

  return (
    <select
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cx(selectClassName, className)}
      {...props}
    >
      {supportsBaseSelect ? (
        <button
          aria-label={pickerName}
          aria-labelledby={ariaLabelledBy}
          type="button"
        >
          <selectedcontent />
        </button>
      ) : null}
      {children}
    </select>
  );
}

export { Select };
