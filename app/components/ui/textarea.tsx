import type * as React from 'react';

import { cn } from '~/utils/utils';

const Textarea = ({
	className,
	...props
}: React.ComponentProps<'textarea'>) => (
	<textarea
		className={cn(
			'field-sizing-content flex min-h-16 w-full rounded-md border border-neutral-600 bg-white px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-neutral-400 focus-visible:border-neutral-600 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		data-slot="textarea"
		{...props}
	/>
);

export { Textarea };
