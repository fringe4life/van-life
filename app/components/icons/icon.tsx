import type { ComponentType, ReactElement, ReactNode, SVGProps } from "react";
import { css, cx } from "styled-system/css";

/**
 * Shared contract for the custom SVG set. Replaces `LucideIcon`.
 *
 * Glyphs are 24x24, stroke 1.6, `currentColor` at rest. Sizing is owned by the
 * caller through `size` or `className`, never by the glyph.
 */
interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "fill" | "stroke" | "viewBox"> {
  size?: number;
  title?: string;
}

type IconComponent = ComponentType<IconProps>;

interface IconShellProps extends IconProps {
  children: ReactNode;
}

const iconRoot = css({
  display: "block",
  flexShrink: "0",
  overflow: "visible",
});

const IconShell = ({
  children,
  className,
  size = 24,
  title,
  ...rest
}: IconShellProps): ReactElement => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: glyphs are decorative by default; passing `title` opts into a labelled image
  <svg
    aria-hidden={title ? undefined : "true"}
    className={cx(iconRoot, className)}
    fill="none"
    height={size}
    role={title ? "img" : undefined}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.6}
    viewBox="0 0 24 24"
    width={size}
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    {children}
  </svg>
);

export type { IconComponent, IconProps };
export { IconShell };
