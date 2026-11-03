import type { ComponentProps, ReactNode } from "react";
import { css, cx } from "styled-system/css";
import { ChevronIcon } from "~/components/icons/chevron-icon";
import { useSupportsBaseSelect } from "~/hooks/use-supports-base-select";

/*
 * The disclosure arrow is ours on both paths (#458). `base-select` hides the
 * UA's `::picker-icon`, whose shape we can never set, and the legacy path drops
 * the background-image data URI with its hard-coded hex: the vendored
 * `ChevronIcon` is drawn once, positioned over the control, and follows
 * `currentColor`. Same geometry as the pagination arrows and the host trigger,
 * at the same 16px.
 */
const wrapperClassName = css({
  "&:has(select:open) [data-select-disclosure]": { rotate: "180deg" },
  display: "inline-flex",
  inlineSize: "fit-content",
  position: "relative",
});

const disclosureClassName = css({
  blockSize: "4",
  color: "muted.foreground",
  inlineSize: "4",
  insetInlineEnd: "3",
  pointerEvents: "none",
  position: "absolute",
  top: "1/2",
  transitionDuration: "normal",
  transitionProperty: "rotate",
  translate: "0 -50%",
});

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
    "& > button": {
      alignItems: "center",
      display: "inline-flex",
      gap: "2",
    },
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
    // The UA's picker icon is a filled pointer we cannot redraw; ours replaces it.
    "&::picker-icon": {
      display: "none",
    },
    alignItems: "center",
    appearance: "base-select",
    backgroundImage: "none",
    display: "flex",
    gap: "2",
    paddingInlineEnd: "4",
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

/*
 * `<selectedcontent>` clones the selected option's markup, but the clone is
 * taken when the button is inserted — before the option children exist — and
 * Chrome does not refresh it when an option's content changes afterwards. A
 * select that needs a glyph in its closed state therefore renders that glyph
 * itself and hides any clone, which would otherwise show a second one.
 */
const selectedIconSlotClassName = css({
  _supportsBaseSelect: {
    "& selectedcontent svg": { display: "none" },
  },
});

interface SelectProps extends ComponentProps<"select"> {
  /**
   * Rendered inside the customizable-select button, before the cloned option
   * content. Use it when the closed control has to show something the browser
   * will not clone — see `selectedIconSlotClassName`.
   */
  selectedIcon?: ReactNode;
}

function Select({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  children,
  selectedIcon,
  ...props
}: SelectProps) {
  const supportsBaseSelect = useSupportsBaseSelect();
  const pickerName = ariaLabelledBy ? undefined : (ariaLabel ?? "Select");

  return (
    <span className={wrapperClassName}>
      <select
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cx(
          selectClassName,
          selectedIcon ? selectedIconSlotClassName : undefined,
          className
        )}
        {...props}
      >
        {supportsBaseSelect ? (
          <button
            aria-label={pickerName}
            aria-labelledby={ariaLabelledBy}
            type="button"
          >
            {selectedIcon}
            <selectedcontent />
          </button>
        ) : null}
        {children}
      </select>
      {/* Decorative: the select already announces itself and its value. */}
      <span
        aria-hidden="true"
        className={disclosureClassName}
        data-select-disclosure=""
      >
        <ChevronIcon direction="down" size={16} />
      </span>
    </span>
  );
}

export { Select };
