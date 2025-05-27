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

export async function loader({ params }: Route.ClientLoaderArgs) {
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
        <Card>
          <CardHeader>
            <img src={imageUrl} alt={description} />
          </CardHeader>
          <CardContent>
            <Badge color={type}>{type}</Badge>
            <CardTitle>{name}</CardTitle>
            <p>{price}</p>
            <CardDescription>{description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button className={badgeVariants({ variant: "SIMPLE" })}>
              Rent this van
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
