import { Card, CardFooter, CardHeader } from '~/components/ui/card';

export default function VanCardSkeleton() {
	return (
		<div className="@container/card xs:scroll-sm scroll-md md:scroll-lg contain-content contain-inline-size [contain-intrinsic-size:auto_300px_auto_200px] [content-visibility:auto]">
			<Card className="relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4">
				<CardHeader className="relative @min-md/card:col-start-1 @min-md/card:row-span-2">
					{/* Van Badge Skeleton */}
					<div className="absolute top-2 right-2 z-10 h-6 w-16 animate-pulse rounded-full bg-gray-300" />

					{/* Image Skeleton */}
					<div className="aspect-square w-full animate-pulse rounded-md bg-gray-300" />
				</CardHeader>

				<CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 grid-cols-subgrid grid-rows-subgrid @min-md/card:content-center">
					{/* Title Skeleton */}
					<div className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start">
						<div className="h-8 w-3/4 animate-pulse rounded bg-gray-300" />
					</div>

					{/* Action Skeleton */}
					<div className="h-8 w-16 animate-pulse rounded bg-gray-300" />

					{/* Badge Skeleton */}
					<div className="@min-md/card:-row-end-1 h-6 w-20 animate-pulse rounded-full bg-gray-300" />
				</CardFooter>
			</Card>
		</div>
	);
}
