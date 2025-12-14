import type * as React from 'react';

import { cn } from '~/utils/utils';

const Card = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		className={cn(
			'rounded-xl border bg-white p-6 text-neutral-900 shadow-sm',
			className
		)}
		data-slot="card"
		{...props}
	/>
);
// has-data-[slot=card-action]:grid-cols-[1fr_auto]
const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		className={cn('[.border-b]:pb-6', className)}
		data-slot="card-header"
		{...props}
	/>
);

const CardTitle = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		className={cn('text-balance font-semibold', className)}
		data-slot="card-title"
		{...props}
	/>
);

const CardDescription = ({
	className,
	...props
}: React.ComponentProps<'div'>) => (
	<div
		className={cn('text-sm', className)}
		data-slot="card-description"
		{...props}
	/>
);

const CardAction = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		className={cn(
			'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
			className
		)}
		data-slot="card-action"
		{...props}
	/>
);

const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div className={cn('', className)} data-slot="card-content" {...props} />
);

const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		className={cn('[.border-t]:pt-6', className)}
		data-slot="card-footer"
		{...props}
	/>
);

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
