import type React from 'react';
import { cn, isEmptyList } from '~/utils/utils';

import UnsuccesfulState from './UnsuccesfulState';

export interface GenericComponentProps<
	T,
	P,
	E extends React.ElementType = 'div',
> {
	Component: React.ComponentType<P>;
	items: T[] | string;
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
	emptyStateMessage: string;
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
	as,
	wrapperProps,
}: GenericComponentProps<T, P, E>) => {
	const isEmpty = isEmptyList(items);
	const isError = typeof items === 'string';
	if (isEmpty || isError) {
		return <UnsuccesfulState message={emptyStateMessage} isError />;
	}
	const Wrapper = as || 'div';
	return (
		<Wrapper className={cn('flex grow ', className)} {...wrapperProps}>
			{items.map((item, index) => (
				<Component key={renderKey(item, index)} {...renderProps(item, index)} />
			))}
		</Wrapper>
	);
};

export default GenericComponent;
