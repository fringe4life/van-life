import clsx from 'clsx';
import type React from 'react';
import { Form } from 'react-router';
import useIsNavigating from '~/hooks/use-is-navigating';

export default function CustomForm({
	children,
	className,
	...props
}: React.ComponentProps<typeof Form>) {
	const { usingForm } = useIsNavigating();
	return (
		<Form className={clsx(className, !!usingForm && 'opacity-75')} {...props}>
			<fieldset className={className} disabled={usingForm}>
				{children}
			</fieldset>
		</Form>
	);
}
