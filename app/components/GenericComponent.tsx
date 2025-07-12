import type React from 'react';
import { isEmptyList } from '~/utils/utils';
import EmptyState from './EmptyState';

export interface GenericComponentProps<T, P> {
	Component: React.ComponentType<P>;
	items: T[];
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
	emptyStateMessage: string;
}

const GenericComponent = <T, P>({
	Component,
	items,
	renderProps,
	renderKey,
	className = '',
	emptyStateMessage,
}: GenericComponentProps<T, P>) => {
	const isEmpty = isEmptyList(items);
	if (isEmpty) {
		return <EmptyState message={emptyStateMessage} />;
	}
	return (
		<div className={className}>
			{items.map((item, index) => (
				<Component key={renderKey(item, index)} {...renderProps(item, index)} />
			))}
		</div>
	);
};

export default GenericComponent;
