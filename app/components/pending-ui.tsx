import type { Prettify } from "better-auth";
import type { ElementType, ReactNode } from "react";
import useIsNavigating from "~/hooks/use-is-navigating";
import { cn } from "~/utils/utils";
import type { AsProps } from "./types";

type PendingUIProps<T extends ElementType = "div"> = Prettify<
  AsProps<T> & {
    /** Children to render */
    children: ReactNode;
    /** Additional CSS classes to merge with pending UI classes */
    className?: string;
    /** Whether to show pending UI (defaults to useIsNavigating hook) */
    isPending?: boolean;
  }
>;

/**
 * A polymorphic component that applies pending UI styling to any HTML element.
 *
 * Features:
 * - Polymorphic `as` prop to render any HTML element
 * - Automatic pending state detection via useIsNavigating hook
 * - Fixed `opacity-75` when pending
 * - Fixed 200ms transition duration for consistency
 * - ClassName merging with cn utility
 * - Type-safe props based on the element type
 *
 * @param props - Component props
 * @param props.as - The HTML element to render (default: 'div')
 * @param props.className - Additional CSS classes
 * @param props.isPending - Override pending state (optional)
 * @param props.children - Content to render
 * @param props.rest - All other props for the HTML element
 *
 * @example
 * ```tsx
 * // Basic usage with div
 * <PendingUI className="grid gap-4">
 *   <h1>Title</h1>
 *   <p>Content</p>
 * </PendingUI>
 *
 * // As section element
 * <PendingUI as="section" className="grid grid-cols-1">
 *   <h2>Section Title</h2>
 * </PendingUI>
 *
 * // Custom pending state
 * <PendingUI as="main" isPending={isLoading} className="container mx-auto">
 *   <p>Custom pending behavior</p>
 * </PendingUI>
 * ```
 */
const PendingUI = <T extends ElementType = "div">({
  as,
  className,
  isPending,
  children,
  ...rest
}: PendingUIProps<T>) => {
  const { changingPage } = useIsNavigating();
  const isCurrentlyPending = isPending ?? changingPage;

  const Component = as || "div";

  return (
    <Component
      className={cn(
        "transition-opacity duration-200",
        isCurrentlyPending && "opacity-75",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export { PendingUI };
