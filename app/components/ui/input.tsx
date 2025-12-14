import type * as React from 'react';

import { cn } from '~/utils/utils';

const Input = ({
	className,
	type,
	...props
}: React.ComponentProps<'input'>) => (
	<input
		className={cn(
			'flex h-9 w-full min-w-0 rounded-md border border-neutral-600/80 bg-white px-3 py-1 text-neutral-900 shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-neutral-600 file:text-sm placeholder:text-neutral-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			'focus-visible:border-neutral-600 focus-visible:ring-2',
			className
		)}
		data-slot="input"
		type={type}
		{...props}
	/>
);
export { Input };
