import type React from 'react';
import { Fragment } from 'react';

export type ListItemProps<T> = {
	items: T[];
	getKey: (t: T) => React.Key;
	getRow: (t: T) => React.ReactNode;
};

export default function ListItems<T>({
	getKey,
	getRow,
	items,
}: ListItemProps<T>) {
	return items.map((d) => <Fragment key={getKey(d)}>{getRow(d)}</Fragment>);
}
