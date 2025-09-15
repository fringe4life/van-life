import { lazy, Suspense } from 'react';
import BarChartSkeleton from './BarChartSkeleton';

const BarChartComponent = lazy(() => import('./BarChart'));

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
