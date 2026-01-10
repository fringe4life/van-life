import { useOptimistic } from 'react';
import type { LowercaseVanType } from '~/features/vans/types';
import { typesFilterReducer } from './types-filter-reducer';

const useOptimisticTypesFilter = (initialTypes: LowercaseVanType[]) => {
	const [optimisticTypes, addOptimisticType] = useOptimistic(
		initialTypes,
		typesFilterReducer
	);

	const toggleType = (type: LowercaseVanType) => {
		addOptimisticType({ type });
	};

	return [optimisticTypes, toggleType] as const;
};

export { useOptimisticTypesFilter };
