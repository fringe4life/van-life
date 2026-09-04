import { css, cx } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";

export const brandClassName = css({
  alignItems: "center",
  display: "inline-flex",
  fontSize: { base: "xl", xs: "2xl" },
  fontWeight: "black",
  minBlockSize: "48px",
  textTransform: "uppercase",
});

export const navOuterClassName = css({
  display: "grid",
  gridArea: "nav",
  isolation: "isolate",
  minInlineSize: "0",
  position: "sticky",
  top: "0",
  zIndex: 1,
});

export const navShellClassName = css({
  alignItems: "center",
  alignSelf: "start",
  backgroundColor: "surface",
  blockSize: "var(--header-height)",
  borderColor: "transparent",
  borderStyle: "solid",
  borderWidth: "1px",
  boxSizing: "border-box",
  color: "foreground",
  display: "grid",
  gap: { base: "3", md: "6" },
  gridTemplateColumns: {
    base: "minmax(0, 1fr) auto",
    md: "minmax(0, 1fr) auto minmax(0, 1fr)",
  },
  paddingBlock: "7",
  paddingInline: { base: "0", md: "padding-inline" },
  position: "relative",
  zIndex: 1,
});

export const navBrandClassName = css({
  minInlineSize: "0",
  overflow: "hidden",
});

export const desktopPageNavClassName = css({
  display: { base: "none", md: "block" },
  justifySelf: "center",
  minInlineSize: "0",
});

export const desktopAuthNavClassName = css({
  display: { base: "none", md: "block" },
  justifySelf: "end",
  minInlineSize: "0",
});

export const desktopNavListClassName = hstack({
  gap: { base: "2", lg: "3" },
  justifyContent: "center",
  listStyleType: "none",
  margin: "0",
  padding: "0",
});

export const mobileNavButtonClassName = css({
  _focusVisible: {
    outlineColor: "ring",
    outlineOffset: "3px",
    outlineStyle: "solid",
    outlineWidth: "3px",
  },
  _hover: {
    backgroundColor: "surface.muted",
  },
  alignItems: "center",
  blockSize: "var(--nav-control-size)",
  cursor: "pointer",
  display: { base: "inline-flex", md: "none" },
  inlineSize: "var(--nav-control-size)",
  justifyContent: "center",
  minBlockSize: "var(--nav-control-size)",
  minInlineSize: "var(--nav-control-size)",
  padding: "1",
  rounded: "md",
  transitionDuration: "normal",
  transitionProperty: "colors",
});

export const mobileNavDrawerClassName = css({
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
  gap: "8",
  inlineSize: "full",
  inset: "0",
  justifyContent: "center",
  opacity: "0",
  overflowY: "auto",
  paddingInline: "padding-inline",
  position: "absolute",
  textAlign: "center",
  transitionDuration: "var(--duration-dialog)",
  transitionProperty: "translate,opacity",
  transitionTimingFunction: "glide",
  translate: "100% 0",
});

export const mobileNavSectionClassName = css({
  display: "grid",
  gap: "3",
  justifyItems: "center",
});

export const mobileNavSectionListClassName = vstack({
  alignItems: "center",
  gap: "6",
  listStyleType: "none",
  margin: "0",
  padding: "0",
});

export const linkClassName = cx(
  css({
    _focusVisible: {
      outlineColor: "ring",
      outlineOffset: "3px",
      outlineStyle: "solid",
      outlineWidth: "3px",
    },
    _hover: {
      backgroundColor: "surface.accent",
      color: "accent.foreground",
    },
    alignItems: "center",
    borderRadius: "md",
    minBlockSize: "48px",
    paddingBlock: "1",
    paddingInline: "2",
    transitionDuration: "normal",
    transitionProperty: "colors",
    whiteSpace: "nowrap",
  }),
  hstack({ gap: "2" })
);

export const navLinkClassName = cx(
  linkClassName,
  css({
    "&.pending": {
      color: "success",
    },
    "&[aria-current='page']": {
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
  })
);
