import { lazy, Suspense } from 'react';
import BarChartSkeleton from './bar-chart-skeleton';

const BarChartComponent = lazy(() => import('./bar-chart'));

type LazyBarChartProps = {
	mappedData: {
		name: string;
		amount: number;
	}[];
};

export default function LazyBarChart({ mappedData }: LazyBarChartProps) {
	return (
		<Suspense fallback={<BarChartSkeleton />}>
			<BarChartComponent mappedData={mappedData} />
		</Suspense>
	);
}
