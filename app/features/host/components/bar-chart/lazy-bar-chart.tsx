import { lazy, Suspense } from 'react';
import type { BarChartComponentProps } from './bar-chart';
import BarChartSkeleton from './bar-chart-skeleton';

const BarChartComponent = lazy(() => import('./bar-chart'));

export default function LazyBarChart({ mappedData }: BarChartComponentProps) {
	return (
		<Suspense fallback={<BarChartSkeleton />}>
			<BarChartComponent mappedData={mappedData} />
		</Suspense>
	);
}
