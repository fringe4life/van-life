import type React from 'react';
import type { GenericComponentProps } from '~/types/types';
import { UnsuccesfulState } from './unsuccesful-state';

const GenericComponent = <T, P, E extends React.ElementType = 'div'>({
	Component,
	items,
	renderProps,
	renderKey,
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
				<Component key={renderKey(item, index)} {...renderProps(item, index)} />
			))}
		</Wrapper>
	);
};

export { GenericComponent };
