import type { JSX } from 'react';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import type { Data } from '~/features/host/types';
import type { EmptyState, ErrorState, List } from '~/types/types';

export const renderEmptyOrErrorState = <
	T,
	P extends Data<List<T>> & EmptyState & ErrorState,
>({
	data,
	errorStateMessage,
	emptyStateMessage,
}: P): JSX.Element | T[] => {
	const isError = !data;
	if (isError) {
		return <UnsuccesfulState isError message={errorStateMessage} />;
	}

	const isEmpty = data.length === 0;
	if (isEmpty) {
		return <UnsuccesfulState message={emptyStateMessage} />;
	}

	return data;
};
