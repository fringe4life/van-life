import { getVan } from "~/db/getVan";
import type { Route } from "./+types/van";
import { data, Link, redirect, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.van) {
    return [
      { title: "Not found | Vanlife" },
      {
        name: "details",
        content: "This van was not found",
      },
    ];
  }
  return [
    { title: `${data.van.name} | Vanlife` },
    {
      name: "details",
      content: `The details about ${data.van.name}`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const van = await getVan(params.vanId);
  if (!van) throw redirect("/notfound");
  return { van };
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {
  const {
    van: { imageUrl, type, name, price, description },
  } = loaderData;

  const location = useLocation();

  const typeFilter = location.state?.type || "";

  return (
    <>
      <Link
        to={{
          pathname: "/vans",
          search: `?type=${typeFilter}`,
        }}
      >
        &larr; back to {typeFilter ? typeFilter : "all"} vans
      </Link>
      <div className="@container/card-full">
        <Card className="@max-2xl/card-full:grid @max-2xl/card-full:grid-rows-[4fr_repeat(4,_auto)_auto] @max-2xl:/card-full:gap-4  @max-2xl/card-full:bg-green-500  @max-7xl/card-full:bg-indigo-500">
          <CardHeader className=" ">
            <img src={imageUrl} alt={description} />
          </CardHeader>
          <CardContent className=" @max-2xl/card-full:rows-span-4  @max-2xl/card-full:grid-rows-subgrid @max-2xl/card-full:row-start-2  @max-2xl/card-full:align-between">
            <Badge color={type} className="">
              {type}
            </Badge>
            <CardTitle className="">{name}</CardTitle>
            <p>{price}</p>
            <CardDescription>{description}</CardDescription>
          </CardContent>
          {/* @max-2xl/card-full:row-span-1 */}
          <CardFooter className="">
            <Button
              className={cn(
                badgeVariants({ variant: "SIMPLE" }),
                "@max-lg/card-full:w-full"
              )}
            >
              Rent this van
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
