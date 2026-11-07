import { Link, type LinkProps } from "react-router";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import useIsPage from "~/hooks/use-is-page";
export type CustomLinkProps = Omit<LinkProps, "style">;

const CustomLink = ({ children, to, className, ...rest }: CustomLinkProps) => {
  const { isPage } = useIsPage({ to });
  return (
    <Link
      className={cx(
        css({ _hover: { textDecoration: "underline" } }),
        className,
        isPage ? css({ pointerEvents: "none" }) : css({ pointerEvents: "auto" })
      )}
      to={to}
      {...rest}
      prefetch="intent"
    >
      {children}
    </Link>
  );
};

export { CustomLink };
