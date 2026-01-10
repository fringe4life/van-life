import { useOptimistic } from 'react';
import { booleanFilterReducer } from './boolean-filter-reducer';

const useOptimisticBooleanFilter = (initialValue: boolean) => {
	const [optimisticValue, toggleOptimistic] = useOptimistic(
		initialValue,
		booleanFilterReducer
	);

	return [optimisticValue, toggleOptimistic] as const;
};

export { useOptimisticBooleanFilter };
