import { lazy, Suspense } from 'react';
import type { BarChartComponentProps } from './bar-chart';
import BarChartSkeleton from './bar-chart-skeleton';

const BarChartComponent = lazy(() => import('./bar-chart'));

const LazyBarChart = ({ mappedData }: BarChartComponentProps) => (
	<Suspense fallback={<BarChartSkeleton />}>
		<BarChartComponent mappedData={mappedData} />
	</Suspense>
);

export default LazyBarChart;
