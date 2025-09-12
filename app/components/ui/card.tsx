import type * as React from 'react';

import { cn } from '~/utils/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'rounded-xl border bg-white p-6 text-neutral-900 shadow-sm',
				className
			)}
			data-slot="card"
			{...props}
		/>
	);
}
// has-data-[slot=card-action]:grid-cols-[1fr_auto]
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('[.border-b]:pb-6', className)}
			data-slot="card-header"
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('text-balance font-semibold', className)}
			data-slot="card-title"
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('text-sm', className)}
			data-slot="card-description"
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className
			)}
			data-slot="card-action"
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('', className)} data-slot="card-content" {...props} />
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('[.border-t]:pt-6', className)}
			data-slot="card-footer"
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
