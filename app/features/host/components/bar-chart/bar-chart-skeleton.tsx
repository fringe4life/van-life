const BarChartSkeleton = () => (
	<div className="h-full w-full animate-pulse">
		{/* Chart area with 6 bars using CSS pseudo-random heights via custom properties */}
		<div className="flex h-(--chart-content-height) items-end justify-between gap-2 px-4 [&>div:nth-child(1)]:[--bar-index:1] [&>div:nth-child(2)]:[--bar-index:2] [&>div:nth-child(3)]:[--bar-index:3] [&>div:nth-child(4)]:[--bar-index:4] [&>div:nth-child(5)]:[--bar-index:5] [&>div:nth-child(6)]:[--bar-index:6]">
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
			<div className="bar-height w-1/8 rounded-t bg-orange-400/80" />
		</div>

		{/* Text area using CSS custom properties for consistent sizing */}
		<div className="mx-auto mt-(--chart-text-top-margin)">
			<div className="mb-(--chart-text-gap) h-(--chart-text-first-height) w-3/4 rounded bg-orange-400/80" />
			<div className="h-(--chart-text-second-height) w-1/2 rounded bg-orange-400/80" />
		</div>
	</div>
);

export { BarChartSkeleton };
