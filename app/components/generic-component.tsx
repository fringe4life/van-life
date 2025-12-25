import type React from 'react';
import type { EmptyState, ErrorState, Maybe } from '~/types/types';
import UnsuccesfulState from './unsuccesful-state';

export interface GenericComponentProps<
	T,
	P,
	E extends React.ElementType = 'div',
> extends EmptyState,
		ErrorState {
	Component: React.ComponentType<P>;
	items: Maybe<T[]>;
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
	as?: E;
	wrapperProps?: React.ComponentPropsWithoutRef<E>;
}

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

export default GenericComponent;
