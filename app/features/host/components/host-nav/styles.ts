import { css, cx } from "styled-system/css";
import { navLinkClassName } from "~/features/navigation/styles";

const hostNavLinkLayoutClassName = css({
  _currentPage: {
    backgroundColor: "surface.accent",
    fontWeight: "medium",
  },
  _focusVisible: {
    focusRingColor: "ring",
    focusRingOffset: "0",
    focusRingWidth: "2px",
    focusVisibleRing: "outside",
  },
  alignItems: "center",
  borderRadius: "md",
  display: "flex",
  flexWrap: "nowrap",
  gap: "2",
  minBlockSize: "11",
  minInlineSize: "0",
  outline: "none",
  paddingBlock: "2",
  paddingInline: "2",
  textDecoration: "none",
  transitionDuration: "normal",
  transitionProperty: "background-color,color",
});

const hostNavLinkClassName = cx(navLinkClassName, hostNavLinkLayoutClassName);

const hostNavLinkLabelClassName = css({
  minInlineSize: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const hostNavIconClassName = css({
  blockSize: "5",
  color: "currentColor",
  flexShrink: "0",
  inlineSize: "5",
});

const hostNavGroupHeadingClassName = css({
  alignItems: "baseline",
  color: "muted.foreground",
  display: "flex",
  fontSize: "2xs",
  fontWeight: "bold",
  gap: "2",
  justifyContent: "space-between",
  letterSpacing: "0.12em",
  lineHeight: "4",
  textTransform: "uppercase",
});

const hostNavGroupCountClassName = css({
  fontSize: "2xs",
  fontWeight: "normal",
  letterSpacing: "normal",
  textTransform: "none",
});

const hostNavGroupClassName = css({
  minInlineSize: "0",
});

const hostNavListClassName = css({
  display: "grid",
  gap: "1",
  marginBlockStart: "2",
  minInlineSize: "0",
});

const hostNavActivityListClassName = css({
  "@host-nav/md": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
});

const hostNavMobileListClassName = css({
  gridTemplateColumns: {
    base: "minmax(0, 1fr)",
    xs: "repeat(2, minmax(0, 1fr))",
  },
});

const hostNavMobileSingleColumnListClassName = css({
  gridTemplateColumns: "minmax(0, 1fr)",
});

const hostNavClassName = css({
  display: { base: "none", md: "block" },
  minInlineSize: "0",
});

const hostNavSurfaceClassName = css({
  "@host-nav/md": {
    padding: "0",
    rounded: "lg",
    shadow: "none",
  },
  padding: "4",
});

const hostNavKickerClassName = css({
  "@host-nav/md": {
    display: "none",
  },
  "& strong": {
    color: "foreground",
    display: "block",
    fontSize: "sm",
    letterSpacing: "-0.02em",
    lineHeight: "5",
    marginBlockStart: "1",
    textTransform: "none",
  },
  borderBlockEndColor: "border.subtle",
  borderBlockEndStyle: "solid",
  borderBlockEndWidth: "1",
  color: "muted.foreground",
  fontSize: "2xs",
  fontWeight: "bold",
  letterSpacing: "0.12em",
  lineHeight: "4",
  paddingBlockEnd: "3",
  textTransform: "uppercase",
});

const hostNavGroupsClassName = css({
  "@host-nav/md": {
    "& > section + section": {
      borderBlockStartStyle: "none",
      borderBlockStartWidth: "0",
      borderInlineStartColor: "border.subtle",
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: "1",
      marginBlockStart: "0",
      paddingBlockStart: "4",
    },
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)",
    marginBlockStart: "0",
  },
  "& > section + section": {
    borderBlockStartColor: "border.subtle",
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1",
    marginBlockStart: "4",
    paddingBlockStart: "4",
  },
  marginBlockStart: "4",
});

const hostNavGroupLayoutClassName = css({
  "@host-nav/md": {
    padding: "4",
  },
  minInlineSize: "0",
});

const hostNavMobileClassName = css({
  display: { base: "block", md: "none" },
  minInlineSize: "0",
  position: "relative",
});

const hostNavMobileBarClassName = css({
  "& > a[aria-current='page']": {
    flex: "1",
    fontSize: "xs",
    gap: "1",
    minInlineSize: "0",
    paddingInline: "1",
  },
  alignItems: "center",
  backgroundColor: "card",
  borderColor: "border",
  borderStyle: "solid",
  borderWidth: "1",
  display: "flex",
  gap: "2",
  justifyContent: "space-between",
  minInlineSize: "0",
  padding: "1",
  rounded: "lg",
});

const hostNavMobileTriggerClassName = css({
  _hover: {
    backgroundColor: "surface.accent",
  },
  alignItems: "center",
  anchorName: "--host-menu-trigger",
  backgroundColor: "card",
  borderColor: "border",
  borderRadius: "md",
  borderStyle: "solid",
  borderWidth: "1",
  color: "card.foreground",
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: "0",
  fontSize: "xs",
  fontWeight: "medium",
  gap: "1",
  justifyContent: "center",
  minBlockSize: "11",
  minInlineSize: "0",
  paddingInline: "2",
});

const hostNavMobileTriggerIconClassName = css({
  blockSize: "4",
  flexShrink: "0",
  inlineSize: "4",
});

const hostNavMobilePopoverClassName = css({
  inlineSize: "min(20rem, calc(100vw - 2rem))",
  insetBlockStart: "anchor(bottom)",
  insetInlineEnd: "anchor(right)",
  margin: "0",
  marginBlockStart: "2",
  marginInlineStart: "auto",
  maxBlockSize: "min(70dvh, 32rem)",
  overflowY: "auto",
  position: "absolute",
  positionAnchor: "--host-menu-trigger",
  zIndex: "10",
});

const hostNavMobilePopoverCountClassName = css({
  color: "muted.foreground",
  fontSize: "2xs",
  fontWeight: "normal",
  letterSpacing: "normal",
  textTransform: "none",
});

export {
  hostNavActivityListClassName,
  hostNavClassName,
  hostNavGroupClassName,
  hostNavGroupCountClassName,
  hostNavGroupHeadingClassName,
  hostNavGroupLayoutClassName,
  hostNavGroupsClassName,
  hostNavIconClassName,
  hostNavKickerClassName,
  hostNavLinkClassName,
  hostNavLinkLabelClassName,
  hostNavListClassName,
  hostNavMobileBarClassName,
  hostNavMobileClassName,
  hostNavMobileListClassName,
  hostNavMobilePopoverClassName,
  hostNavMobilePopoverCountClassName,
  hostNavMobileSingleColumnListClassName,
  hostNavMobileTriggerClassName,
  hostNavMobileTriggerIconClassName,
  hostNavSurfaceClassName,
};
