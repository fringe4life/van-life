import { Card, CardFooter, CardHeader } from "~/components/ui/card";

const VanCardSkeleton = () => (
  <div className="@container/card xs:scroll-sm scroll-md md:scroll-lg contain-content contain-inline-size [contain-intrinsic-size:auto_300px_auto_200px] [content-visibility:auto]">
    <Card className="relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4">
      <CardHeader className="relative @min-md/card:col-start-1 @min-md/card:row-span-2">
        {/* Van Badge Skeleton */}
        <div className="absolute top-2 right-2 z-10 h-6 w-16 rounded-full bg-skeleton" />

        {/* Image Skeleton */}
        <div className="aspect-square w-full rounded-md bg-skeleton" />
      </CardHeader>

      <CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 grid-cols-subgrid grid-rows-subgrid @min-md/card:content-center">
        {/* Title Skeleton */}
        <div className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start">
          <div className="h-8 w-3/4 rounded bg-skeleton" />
        </div>

        {/* Action Skeleton */}
        <div className="h-8 w-16 rounded bg-skeleton" />

        {/* Badge Skeleton */}
        <div className="@min-md/card:-row-end-1 h-6 w-20 rounded-full bg-skeleton" />
      </CardFooter>
    </Card>
  </div>
);

export { VanCardSkeleton };
