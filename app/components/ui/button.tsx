import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { cn } from '~/utils/utils';

import { type ButtonVariantProps, buttonVariants } from './button-variants';

function Button({
	className,
	variant = 'default',
	size = 'default',
	...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
	return (
		<ButtonPrimitive
			className={cn(buttonVariants({ className, size, variant }))}
			data-slot="button"
			{...props}
		/>
	);
}

export { Button };
