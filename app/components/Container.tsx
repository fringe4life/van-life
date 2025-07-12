import type React from 'react';

export interface GenericComponentProps<T, P> {
	Component: React.ComponentType<P>;
	items: T[];
	renderProps: (item: T, index: number) => P;
	renderKey: (item: T, index: number) => React.Key;
	className?: string;
}

const GenericComponent = <T, P>({
	Component,
	items,
	renderProps,
	renderKey,
	className = '',
}: GenericComponentProps<T, P>) => {
	return (
		<div className={className}>
			{items.map((item, index) => (
				<Component key={renderKey(item, index)} {...renderProps(item, index)} />
			))}
		</div>
	);
};

export default GenericComponent;
