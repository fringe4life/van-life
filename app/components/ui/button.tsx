import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '~/utils/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-black/80  focus-visible:ring-2",
	{
		variants: {
			variant: {
				default: 'bg-orange-400 text-white shadow-xs hover:bg-orange-400/90',
				destructive:
					' text-white bg-red-500 shadow-xs hover:bg-red-500/90 focus-visible:bg-red-500/20 ',
				outline:
					'border text-neutral-900 border-neutral-900 shadow-xs bg-white hover:border-neutral-900/90 ',
				secondary:
					'bg-neutral-900 text-white shadow-xs hover:bg-neutral-900/80',
				ghost: 'hover: hover: ',
				link: ' underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const Button = ({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			data-slot="button"
			{...props}
		/>
	);
};

export { Button, buttonVariants };
