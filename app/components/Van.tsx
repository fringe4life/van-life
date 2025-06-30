import { Link, href } from "react-router";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardFooter, CardTitle } from "./ui/card";
import type { Van } from "~/generated/prisma/client";
import type { Type } from "~/generated/prisma/enums";

type VanProps = {
  van: Van;
  filter: string | null;
};

export default function Van({
  van: { name, price, type, id: vanId, imageUrl, description },
  filter: typeFilter,
}: VanProps) {
  return (
    <div className="@container/card" key={vanId}>
      <Card
        style={{ viewTransitionName: `card-${vanId}` }}
        className="relative grid @max-md/card:grid-cols-[1fr_fit-content] @max-md/card:grid-rows-[1fr_min-content_min-content] @md/card:grid-cols-[200px_1fr_min-content] @md/card:grid-rows-2 @md/card:gap-4 "
      >
        <CardHeader className="@max-md/card:col-span-2  @md/card:col-start-1  @md/card:row-span-2">
          <img
            className="aspect-square rounded-md object-cover "
            src={imageUrl}
            alt={description}
          />
        </CardHeader>
        <CardFooter className="@max-md/card:py-2 @md/card:content-center @max-md/card:row-span-2 @max-md/card:grid @max-md/card:col-span-2 @md/card:grid-cols-subgrid @md/card:col-span-2 @md/card:col-start-2  @md/card:row-span-2 @md/card:grid-rows-subgrid ">
          <CardTitle className=" text-2xl @md/card:col-start-1  @md/card:self-end">
            <Link
              to={href("/vans/:vanId", { vanId })}
              state={{
                type: typeFilter,
              }}
              className="  "
            >
              {name}
              <span className="absolute w-full h-full inset-0 overflow-hidden"></span>
            </Link>
          </CardTitle>
          <p className="@max-md/card:justify-self-end @max-md/card:col-start-2 @md/card:row-span-2 @md/card:self-center @md/card:justify-self-end text-lg">
            ${price}
            <p className="@max-md/card:inline text-base @md/card:text-right">
              {" "}
              /day
            </p>
          </p>
          <Badge className="@md/card:self-start " variant={type}>
            {type}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
