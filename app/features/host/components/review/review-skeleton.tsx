import { Card, CardContent } from "~/components/ui/card";

const ReviewSkeleton = () => (
  <div className="@container/review min-w-0 self-start">
    <Card
      aria-hidden="true"
      className="relative grid min-w-0 @min-lg/review:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)] grid-cols-1 items-start @min-lg/review:items-center @min-lg/review:gap-x-8 @min-lg/review:gap-y-0 gap-y-4 overflow-hidden border-border-subtle bg-card p-6 @min-lg/review:pl-10 pl-8 shadow-none"
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-l-xl bg-surface-muted" />
      <CardContent className="contents">
        <div className="min-w-0">
          <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
            <div className="h-3 w-24 rounded bg-skeleton" />
            <div className="h-5 w-20 rounded-full bg-skeleton" />
          </div>
          <div className="h-7 w-3/4 rounded bg-skeleton" />
          <div className="mt-2 h-7 w-1/2 rounded bg-skeleton" />
          <div className="mt-5 h-(--star-size) w-(--rating-stars-width) rounded bg-skeleton" />
        </div>
        <div className="flex min-w-0 flex-row @min-lg/review:flex-col flex-wrap @min-lg/review:items-start items-center @min-lg/review:gap-3 gap-4 @min-lg/review:self-center @min-lg/review:justify-self-end border-border-subtle border-t @min-lg/review:border-t-0 @min-lg/review:border-l @min-lg/review:pt-0 pt-4 @min-lg/review:pl-8">
          <div className="h-3 w-16 rounded bg-skeleton" />
          <div className="h-4 w-24 rounded bg-skeleton" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export { ReviewSkeleton };
