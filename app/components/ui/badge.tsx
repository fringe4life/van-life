import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '~/utils/utils';

const badgeVariants = cva(
	'inline-flex items-center  justify-center  rounded-md px-4 py-2 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-red-500/50 focus-visible:ring-[3px]  transition-[color,box-shadow] overflow-hidden',
	{
		variants: {
			variant: {
				SIMPLE: ' bg-orange-600 text-white [a&]:hover:bg-orange-600/90',
				LUXURY: ' bg-neutral-900 text-white [a&]:hover:bg-neutral-900/90',
				RUGGED:
					' bg-teal-800 text-white  [a&]:hover:bg-teal-800/90 focus-visible:ring-teal-800/20 dark:focus-visible:ring-teal-800/40 dark:bg-teal-800/60',
				OUTLINE: 'bg-orange-100  hover:bg-orange/80 ',
				UNAVAILABLE:
					'bg-red-500 text-white disabled cursor-not-allowed hover:bg-red-500',
			},
		},
		defaultVariants: {
			variant: 'OUTLINE',
		},
	},
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
