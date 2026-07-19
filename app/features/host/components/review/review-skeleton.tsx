import { Card, CardContent, CardHeader } from "~/components/ui/card";

const ReviewSkeleton = () => (
  <Card className="max-w-full contain-content">
    <CardHeader>
      <div className="h-(--star-size) w-(--rating-stars-width) rounded bg-skeleton" />
      <div className="my-4 flex justify-between">
        <div className="h-4 w-[8ch] rounded bg-skeleton" />
        <div className="h-4 w-[20ch] rounded bg-skeleton" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-4 w-3/4 rounded bg-skeleton" />
    </CardContent>
  </Card>
);

export { ReviewSkeleton };
