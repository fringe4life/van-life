import type React from 'react';
import type { GenericComponentProps, Id } from '~/types';
import { UnsuccesfulState } from './unsuccesful-state';

const GenericComponent = <
	T extends Id,
	P,
	E extends React.ElementType = 'div',
>({
	Component,
	items,
	renderProps,
	className = '',
	emptyStateMessage,
	errorStateMessage,
	as,
	wrapperProps,
}: GenericComponentProps<T, P, E>) => {
	const isError = !items;
	const isEmpty = !isError && items.length === 0;
	const message = isError ? errorStateMessage : emptyStateMessage;
	if (isError || isEmpty) {
		return <UnsuccesfulState isError message={message} />;
	}

	const Wrapper = as || 'div';
	return (
		<Wrapper className={className} {...wrapperProps}>
			{items.map((item, index) => (
				<Component key={item.id} {...renderProps(item, index)} />
			))}
		</Wrapper>
	);
};

export { GenericComponent };
