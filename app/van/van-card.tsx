import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import type { Van } from "~/generated/prisma";
import { Badge } from "~/components/ui/badge";
import { href, Link } from "react-router";

export default function VanCard({
  type,
  name,
  id,
  price,
  description,
  imageUrl,
}: Van) {
  return (
    <div className="@container/card">
      <Card className="relative grid @sm/card:grid-cols-[200px_fit-content_auto] @sm/card:grid-rows-2 @sm/card:gap-4 ">
        <CardHeader className="@sm/card:col-start-1 @sm/card:row-span-2">
          <img
            className="aspect-square rounded-md object-cover w-full "
            src={imageUrl}
            alt={description}
          />
        </CardHeader>
        <CardFooter className="grid-cols-subgrid  grid-rows-subgrid @sm/card:col-start-2 justify-between">
          <CardTitle className="text-2xl @sm/card:">
            <Link
              to={href("/vans/:vanId", { vanId: id })}
              className=" @sm/card:row-start-2 @sm/card:col-start-2 @sm/card:place-self-end"
            >
              {name}
              <span className="absolute w-full h-full inset-0 overflow-hidden"></span>
            </Link>
          </CardTitle>
          <p className="justify-self-end">{price}</p>
          <Badge
            className="@sm/card:row-end-3 @sm/card:justify-self-start @sm/card:self-start"
            color={type}
          >
            {type}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
