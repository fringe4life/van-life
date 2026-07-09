import { Link, type LinkProps } from "react-router";
import useIsPage from "~/hooks/use-is-page";
export type CustomLinkProps = Omit<LinkProps, "style">;

const CustomLink = ({ children, to, className, ...rest }: CustomLinkProps) => {
  const { isPage } = useIsPage({ to });
  return (
    <Link
      className={`hover:underline ${className}`}
      to={to}
      {...rest}
      prefetch="intent"
      style={{
        pointerEvents: isPage ? "none" : "auto",
      }}
      viewTransition
    >
      {children}
    </Link>
  );
};

export { CustomLink };
