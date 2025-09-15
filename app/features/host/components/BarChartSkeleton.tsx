const BAR_COUNT = 6;
const MIN_BAR_HEIGHT = 50;
const MAX_BAR_HEIGHT = 250;

export default function BarChartSkeleton() {
	return (
		<div className="h-[350px] w-full animate-pulse">
			{/* Chart area with 6 bars */}
			<div className="flex h-[298px] items-end justify-between gap-2 px-4">
				{Array.from({ length: BAR_COUNT }).map((_, index) => (
					<div
						className="w-1/8 rounded-t bg-orange-400/80"
						// biome-ignore lint/suspicious/noArrayIndexKey: is a skeleton
						key={index}
						style={{
							height: `${Math.random() * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT) + MIN_BAR_HEIGHT}px`,
						}}
					/>
				))}
			</div>

			{/* Text area with 1rem gap from chart */}
			<div className="mx-auto mt-4">
				<div className="mb-2 h-4 w-3/4 rounded bg-orange-400/80" />
				<div className="h-3 w-1/2 rounded bg-orange-400/80" />
			</div>
		</div>
	);
}
