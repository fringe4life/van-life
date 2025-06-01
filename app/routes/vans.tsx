import { getVans } from "~/db/getVans";

import { Type as VanTypes } from "../generated/prisma";
import type { Route } from "./+types/vans";
import { data, href, Link, NavLink, useSearchParams } from "react-router";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Vanlife" },
    {
      name: "description",
      content: "About us",
    },
  ];
}

export async function loader() {
  const badges = Object.values(VanTypes);
  return data(
    { vans: await getVans(), badges },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Vans({ loaderData }: Route.ComponentProps) {
  const { vans, badges } = loaderData;

  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");
  const vansList = typeFilter
    ? vans.filter((van) => van.type === typeFilter.toUpperCase())
    : vans;
  const vansToDisplay = vansList.map(
    ({ imageUrl, description, type, name, price, id: vanId }) => (
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
    )
  );

  const filtersToDisplay = badges.map((type) => {
    const lowerCaseType = type.toLowerCase();
    const variant = typeFilter === type.toLowerCase() ? type : "OUTLINE";
    return (
      <NavLink
        key={lowerCaseType}
        to={{
          search: `?type=${lowerCaseType}`,
        }}
        className={badgeVariants({ variant })}
        viewTransition
      >
        {type}
      </NavLink>
    );
  });

  return (
    <section className="grid-max mb-20">
      <div className="col-span-full">
        <h2 className="text-3xl font-bold mb-5.75 text-balance">
          Explore our van options
        </h2>
        <p className="flex justify-between md:justify-start md:gap-6">
          {filtersToDisplay}{" "}
          <Link className="hover:underline" to={{ search: "" }}>
            Clear filters
          </Link>
        </p>
      </div>
      {vansToDisplay}
    </section>
  );
}
