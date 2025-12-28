import type { ElementType } from 'react';
import useIsNavigating from '~/hooks/use-is-navigating';
import type { PendingUiProps } from '~/types/types';
import { cn } from '~/utils/utils';

/**
 * A polymorphic component that applies pending UI styling to any HTML element.
 *
 * Features:
 * - Polymorphic `as` prop to render any HTML element
 * - Automatic pending state detection via useIsNavigating hook
 * - Customizable opacity (default: 0.75)
 * - Fixed 200ms transition duration for consistency
 * - ClassName merging with cn utility
 * - Type-safe props based on the element type
 *
 * @param props - Component props
 * @param props.as - The HTML element to render (default: 'div')
 * @param props.className - Additional CSS classes
 * @param props.isPending - Override pending state (optional)
 * @param props.pendingOpacity - Custom opacity when pending (default: 0.75)
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
 * // Custom pending state and opacity
 * <PendingUI
 *   as="main"
 *   isPending={isLoading}
 *   pendingOpacity={0.5}
 *   className="container mx-auto"
 * >
 *   <p>Custom pending behavior</p>
 * </PendingUI>
 * ```
 */
const PendingUI = <T extends ElementType = 'div'>({
	as,
	className,
	isPending,
	pendingOpacity = 0.75,
	children,
	...rest
}: PendingUiProps<T>) => {
	const { changingPage } = useIsNavigating();
	const isCurrentlyPending = isPending ?? changingPage;

	// Default to 'div' if no as prop is provided
	const Component = as || 'div';

	// Calculate opacity class based on pending state
	const OpacityPercentageMultiplier = 100;
	const opacityClass = isCurrentlyPending
		? `opacity-${Math.round(pendingOpacity * OpacityPercentageMultiplier)}`
		: '';

	// Merge all classes using cn utility
	const mergedClassName = cn(
		'transition-opacity duration-200',
		opacityClass,
		className
	);

	return (
		<Component className={mergedClassName} {...rest}>
			{children}
		</Component>
	);
};
export { PendingUI };
