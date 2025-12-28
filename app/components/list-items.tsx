import { Fragment } from 'react';
import type { ListItemProps } from '~/types/types';

const ListItems = <T,>({ getKey, getRow, items }: ListItemProps<T>) =>
	items.map((d) => <Fragment key={getKey(d)}>{getRow(d)}</Fragment>);
export { ListItems };
