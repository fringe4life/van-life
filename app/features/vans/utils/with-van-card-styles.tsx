import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { VanModel } from '~/generated/prisma/models';
import { getVanStateStyles } from './van-state-styles';

type WithVanCardStylesProps = ComponentPropsWithoutRef<'div'> & {
	van: VanModel;
	children?: ReactNode;
};

/**
 * Higher-order component that injects van card styling props.
 * Adds van state classes, data-slot attribute, and view transition name.
 *
 * @example
 * ```tsx
 * const StyledCard = withVanCardStyles(Card);
 * <StyledCard van={van} {...otherCardProps}>
 *   {children}
 * </StyledCard>
 * ```
 */
export function withVanCardStyles<P extends ComponentPropsWithoutRef<'div'>>(
	Component: React.ComponentType<P>
) {
	return function VanCardWithStyles({
		van,
		className = '',
		...rest
	}: WithVanCardStylesProps) {
		const { dataSlot, className: vanStateClasses } = getVanStateStyles(van);

		const combinedClassName = `group ${vanStateClasses} ${className}`.trim();

		return (
			<Component
				{...(rest as P)}
				className={combinedClassName}
				data-slot={dataSlot}
				style={{ viewTransitionName: `card-${van.id}` }}
			/>
		);
	};
}
