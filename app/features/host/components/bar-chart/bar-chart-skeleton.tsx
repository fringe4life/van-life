function BarSkeleton() {
	return <div className="bar-height w-1/8 rounded-t bg-orange-400/80" />;
}

export default function BarChartSkeleton() {
	return (
		<div className="h-[var(--chart-height)] w-full animate-pulse">
			{/* Chart area with 6 bars using CSS pseudo-random heights via custom properties */}
			<div className="flex h-[var(--chart-content-height)] items-end justify-between gap-2 px-4 [&>div:nth-child(1)]:[--bar-index:1] [&>div:nth-child(2)]:[--bar-index:2] [&>div:nth-child(3)]:[--bar-index:3] [&>div:nth-child(4)]:[--bar-index:4] [&>div:nth-child(5)]:[--bar-index:5] [&>div:nth-child(6)]:[--bar-index:6]">
				<BarSkeleton />
				<BarSkeleton />
				<BarSkeleton />
				<BarSkeleton />
				<BarSkeleton />
				<BarSkeleton />
			</div>

			{/* Text area using CSS custom properties for consistent sizing */}
			<div className="mx-auto mt-[var(--chart-text-top-margin)]">
				<div className="mb-[var(--chart-text-gap)] h-[var(--chart-text-first-height)] w-3/4 rounded bg-orange-400/80" />
				<div className="h-[var(--chart-text-second-height)] w-1/2 rounded bg-orange-400/80" />
			</div>
		</div>
	);
}
