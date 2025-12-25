import { lazy, Suspense } from 'react';
import UnsuccesfulState from '~/components/unsuccesful-state';
import type { Data, DataArray } from '~/features/host/types';
import type { EmptyState, ErrorState, Maybe } from '~/types/types';
import BarChartSkeleton from './bar-chart-skeleton';

const BarChartComponent = lazy(() => import('./bar-chart'));
const LazyBarChart = <
	T extends Data<Maybe<DataArray>> & EmptyState & ErrorState,
>({
	data,
	errorStateMessage,
	emptyStateMessage,
}: T) => {
	const isError = !data;
	const isEmpty = !isError && data.length === 0;
	const message = isError ? errorStateMessage : emptyStateMessage;
	if (isError || isEmpty) {
		return <UnsuccesfulState isError message={message} />;
	}
	return (
		<Suspense fallback={<BarChartSkeleton />}>
			<BarChartComponent data={data} />
		</Suspense>
	);
};

export default LazyBarChart;
