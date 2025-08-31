import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '~/utils/utils';

const badgeVariants = cva(
	'inline-flex items-center  justify-center  rounded-md  text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-red-500/50 focus-visible:ring-[3px]  transition-opacity overflow-hidden',
	{
		variants: {
			variant: {
				simple: ' bg-orange-600 text-white hover:bg-orange-600/90',
				luxury: ' bg-neutral-900 text-white hover:bg-neutral-900/90',
				rugged:
					'bg-teal-800 text-white  hover:bg-teal-800/90 focus-visible:ring-teal-800/20 ',
				outline: 'bg-orange-100  hover:bg-orange/80 ',
				unavailable:
					'bg-red-500 text-white disabled cursor-not-allowed hover:bg-red-500/90',
			},
			size: {
				default: 'px-4 py-2',
				small: 'px-1 py-0.5',
			},
		},
		defaultVariants: {
			variant: 'outline',
			size: 'default',
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
