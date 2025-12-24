import { lazy, Suspense } from 'react';
import UnsuccesfulState from '~/components/unsuccesful-state';
import type { Maybe } from '~/types/types';
import type { DataArray } from './bar-chart';
import BarChartSkeleton from './bar-chart-skeleton';

const BarChartComponent = lazy(() => import('./bar-chart'));
const LazyBarChart = <T extends Maybe<DataArray>>({
	data,
	errorStateMessage,
	emptyStateMessage,
}: {
	data: T;
	errorStateMessage: string;
	emptyStateMessage: string;
}) => {
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
