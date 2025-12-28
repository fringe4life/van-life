import type { ComponentPropsWithoutRef } from 'react';
import type { WithVanCardStylesProps } from '../types';
import { getVanStateStyles } from './van-state-styles';

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
export const withVanCardStyles = <P extends ComponentPropsWithoutRef<'div'>>(
	Component: React.ComponentType<P>
) => {
	return ({ van, className = '', ...rest }: WithVanCardStylesProps) => {
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
};
