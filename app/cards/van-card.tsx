import { Card, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

import type { Van } from "~/generated/prisma";
import { Badge } from "~/components/ui/badge";
import { href, Link } from "react-router";
// import { useSearchParams } from "react-router";

export default function VanCard({
  type,
  name,
  id,
  price,
  description,
  imageUrl,
}: Van) {
  // const [searchParams, _] = useSearchParams()
  return (
    <div className="@container/card">
      <Card className="relative grid @sm/card:grid-cols-[200px_1fr_min-content] @sm/card:grid-rows-2 @sm/card:gap-4 ">
        <CardHeader className="@sm/card:col-start-1 @sm/card:row-span-2">
          <img
            className="aspect-square rounded-md object-cover "
            src={imageUrl}
            alt={description}
          />
        </CardHeader>
        <CardFooter className="@sm/card:content-center @sm/card:bg-amber-500 @md/card:bg-red-500 @sm/card:grid-cols-subgrid @sm/card:col-span-2   @sm/card:row-span-2 @sm/card:grid-rows-subgrid @sm/card:col-start-2">
          <CardTitle className="text-2xl @sm/card:col-start-2 @sm/card:row-end-2 @sm/card:self-start">
            <Link to={href("/vans/:vanId", { vanId: id })} className="  ">
              {name}
              <span className="absolute w-full h-full inset-0 overflow-hidden"></span>
            </Link>
          </CardTitle>
          <p className="justify-self-end">{price}</p>
          <Badge className="@sm/card:-row-end-1 " color={type}>
            {type}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
