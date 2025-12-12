import type React from 'react';
import type { Id, Maybe } from '~/types/types';
import UnsuccesfulState from './unsuccesful-state';

// Type guard to check if item has an id property
function hasId(item: unknown): item is Id {
	return (
		typeof item === 'object' &&
		item !== null &&
		'id' in item &&
		typeof item.id === 'string'
	);
}

export type GenericComponentProps<T, P, E extends React.ElementType = 'div'> = {
	Component: React.ComponentType<P>;
	items: Maybe<T[]>;
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
	const isError = !items;
	const isEmpty = !isError && items.length === 0;
	if (isError || isEmpty) {
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
