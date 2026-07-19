import { Card, CardContent } from "~/components/ui/card";

const IncomeSkeleton = () => (
  <Card className="contain-content">
    <CardContent>
      <div className="flex justify-between">
        <div className="h-4 w-[8ch] rounded bg-skeleton" />
        <div className="h-4 w-[20ch] rounded bg-skeleton" />
      </div>
    </CardContent>
  </Card>
);

export { IncomeSkeleton };
