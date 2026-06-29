import type React from 'react';
import { Form } from 'react-router';
import useIsNavigating from '~/hooks/use-is-navigating';
import { cn } from '~/utils/utils';

const CustomForm = ({
	children,
	className,
	...props
}: React.ComponentProps<typeof Form>) => {
	const { usingForm } = useIsNavigating();
	return (
		<Form className={cn(className, !!usingForm && 'opacity-75')} {...props}>
			<fieldset className={className} disabled={usingForm}>
				{children}
			</fieldset>
		</Form>
	);
};

export { CustomForm };
