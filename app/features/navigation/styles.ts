import { css, cx } from "../../../styled-system/css";
import { hstack } from "../../../styled-system/patterns";
import type { NavLinkClassNameProps } from "./types";

export const brandClassName = css({
  fontSize: { base: "xl", xs: "2xl" },
  fontWeight: "black",
  textTransform: "uppercase",
});

export const linkClassName = cx(
  css({
    _hover: {
      bg: "primary",
      color: "primary.foreground",
    },
    borderRadius: "md",
    paddingBlock: "1",
    paddingInline: "2",
    transitionDuration: "250ms",
    transitionProperty: "colors",
  }),
  hstack({ gap: "2" })
);

export const navLinkClassName = ({
  isActive,
  isPending,
}: NavLinkClassNameProps) =>
  cx(
    linkClassName,
    isPending && css({ color: "success" }),
    isActive && !isPending && css({ textDecoration: "underline" })
  );
