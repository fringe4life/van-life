const BAR_COUNT = 6;

export default function BarChartSkeleton() {
	return (
		<div className="h-[var(--chart-height)] w-full animate-pulse">
			{/* Chart area with 6 bars using CSS pseudo-random heights via custom properties */}
			<div className="[&>div]:bar-height flex h-[var(--chart-content-height)] items-end justify-between gap-2 px-4 [&>div:nth-child(1)]:[--bar-index:1] [&>div:nth-child(2)]:[--bar-index:2] [&>div:nth-child(3)]:[--bar-index:3] [&>div:nth-child(4)]:[--bar-index:4] [&>div:nth-child(5)]:[--bar-index:5] [&>div:nth-child(6)]:[--bar-index:6]">
				{Array.from({ length: BAR_COUNT }).map((_, index) => (
					<div
						className="w-1/8 rounded-t bg-orange-400/80"
						// biome-ignore lint/suspicious/noArrayIndexKey: is a skeleton
						key={index}
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
