import type React from 'react';
import { isEmptyList } from '~/utils/utils';

import UnsuccesfulState from './unsuccesful-state';

// Type guard to check if item has an id property
function hasId(item: unknown): item is { id: string } {
	return (
		typeof item === 'object' &&
		item !== null &&
		'id' in item &&
		typeof (item as { id: unknown }).id === 'string'
	);
}

export type GenericComponentProps<T, P, E extends React.ElementType = 'div'> = {
	Component: React.ComponentType<P>;
	items: T[] | string;
	renderProps: (item: T, index: number) => P;
	renderKey?: (item: T, index: number) => React.Key;
	className?: string;
	emptyStateMessage: string;
	as?: E;
	wrapperProps?: React.ComponentPropsWithoutRef<E>;
};

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
		return <UnsuccesfulState isError message={emptyStateMessage} />;
	}

	// Smart key extractor: use provided renderKey, or default to id if available, or fallback to index
	const keyExtractor =
		renderKey ?? ((item: T, index: number) => (hasId(item) ? item.id : index));

	const Wrapper = as || 'div';
	return (
		<Wrapper className={className} {...wrapperProps}>
			{items.map((item, index) => (
				<Component
					key={keyExtractor(item, index)}
					{...renderProps(item, index)}
				/>
			))}
		</Wrapper>
	);
};

export default GenericComponent;
