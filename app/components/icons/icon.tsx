import type { ComponentType, ReactElement, ReactNode, SVGProps } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";

/**
 * Shared contract for the custom SVG set. Replaces `LucideIcon`.
 *
 * Glyphs are 24x24, stroke 1.6, `currentColor` at rest. Sizing is owned by the
 * caller through `size` or `className`, never by the glyph.
 *
 * Stroke defaults live in CSS (#466 C) so a class (e.g. status glyphs at
 * stroke 2) beats a presentation attribute. `fill` stays an attribute: a
 * caller `fill` class must win, or the rating rail cannot paint (#506).
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
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "1.6",
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
