import type React from 'react';
import { cn, isEmptyList } from '~/utils/utils';

import UnsuccesfulState from './UnsuccesfulState';

export interface GenericComponentProps<T, P> {
	Component: React.ComponentType<P>;
	items: T[] | string;
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
	const isError = typeof items === 'string';
	if (isEmpty || isError) {
		return <UnsuccesfulState message={emptyStateMessage} isError />;
	}
	return (
		<div className={cn('flex grow flex-col ', className)}>
			{items.map((item, index) => (
				<Component key={renderKey(item, index)} {...renderProps(item, index)} />
			))}
		</div>
	);
};

export default GenericComponent;
