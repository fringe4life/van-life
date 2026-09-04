import type { ComponentProps } from "react";

import { css, cx } from "styled-system/css";

const popoverClassName = css({
  _open: {
    display: "block",
    opacity: "1",
    translate: "0 0",
  },
  _starting: {
    _open: {
      opacity: "1",
    },
    opacity: "0",
    translate: "0 -0.5rem",
  },
  backgroundColor: "popover",
  borderColor: "border.subtle",
  borderStyle: "solid",
  borderWidth: "1",
  color: "popover.foreground",
  outline: "none",
  padding: "4",
  rounded: "xl",
  shadow: "md",
  transitionBehavior: "allow-discrete",
  transitionDuration: "normal",
  transitionProperty: "opacity,translate,display,overlay",
  transitionTimingFunction: "glide",
});

const popoverHeaderClassName = css({
  alignItems: "center",
  borderBlockEndColor: "border.subtle",
  borderBlockEndStyle: "solid",
  borderBlockEndWidth: "1",
  display: "flex",
  gap: "2",
  justifyContent: "space-between",
  minInlineSize: "0",
  paddingBlockEnd: "3",
  paddingInline: "1",
});

const popoverTitleClassName = css({
  color: "muted.foreground",
  fontSize: "2xs",
  fontWeight: "bold",
  letterSpacing: "0.12em",
  lineHeight: "4",
  textTransform: "uppercase",
});

const popoverContentClassName = css({
  minInlineSize: "0",
  paddingBlock: "3",
});

const popoverSectionClassName = css({
  "& + &": {
    borderBlockStartColor: "border.subtle",
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1",
  },
  minInlineSize: "0",
  paddingBlock: "2",
});

const popoverItemClassName = css({
  minInlineSize: "0",
});

type PopoverProps = ComponentProps<"div">;
type PopoverHeaderProps = ComponentProps<"div">;
type PopoverTitleProps = ComponentProps<"h2">;
type PopoverContentProps = ComponentProps<"div">;
type PopoverSectionProps = ComponentProps<"section"> & {
  separated?: boolean;
};
type PopoverItemProps = ComponentProps<"li">;

function Popover({ className, ...props }: PopoverProps) {
  return <div className={cx(popoverClassName, className)} {...props} />;
}

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <header className={cx(popoverHeaderClassName, className)} {...props} />
  );
}

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return <h2 className={cx(popoverTitleClassName, className)} {...props} />;
}

function PopoverContent({ className, ...props }: PopoverContentProps) {
  return <div className={cx(popoverContentClassName, className)} {...props} />;
}

function PopoverSection({
  className,
  separated = false,
  ...props
}: PopoverSectionProps) {
  return (
    <section
      className={cx(
        popoverSectionClassName,
        separated &&
          css({
            borderBlockStartColor: "border.subtle",
            borderBlockStartStyle: "solid",
            borderBlockStartWidth: "1",
          }),
        className
      )}
      {...props}
    />
  );
}

function PopoverItem({ className, ...props }: PopoverItemProps) {
  return <li className={cx(popoverItemClassName, className)} {...props} />;
}

export {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverItem,
  PopoverSection,
  PopoverTitle,
};
