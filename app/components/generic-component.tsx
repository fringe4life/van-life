import type React from 'react';
import type { Items } from '~/features/pagination/types';
import type { Id } from '~/types';
import type { AsProps, EmptyState, ErrorState } from './types';
import { UnsuccesfulState } from './unsuccesful-state';

interface GenericComponentProps<
	T extends Id,
	P,
	E extends React.ElementType = 'div',
> extends EmptyState,
		ErrorState,
		Items<T>,
		AsProps<E> {
	Component: React.ComponentType<P>;
	className?: string;
	renderProps: (item: T, index: number) => P;
	wrapperProps?: React.ComponentPropsWithoutRef<E>;
}

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
				<Component {...renderProps(item, index)} key={item.id} />
			))}
		</Wrapper>
	);
};

export { GenericComponent };
