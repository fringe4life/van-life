import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '~/utils/utils';

import { type BadgeVariantProps, badgeVariants } from './badge-variants';

function Badge({
	className,
	variant = 'outline',
	size = 'default',
	render,
	...props
}: useRender.ComponentProps<'span'> & BadgeVariantProps) {
	return useRender({
		defaultTagName: 'span',
		props: mergeProps<'span'>(
			{
				className: cn(badgeVariants({ variant, size }), className),
			},
			props
		),
		render,
		state: {
			slot: 'badge',
			variant,
			size,
		},
	});
}

export { Badge };
