import { getVan } from "~/db/getVan";
import type { Route } from "../routes/+types/van";
import { redirect } from "react-router";

export async function loader({ params }: Route.ClientLoaderArgs) {
  if (!params.vanId) redirect("vans");
  return { van: await getVan(params.vanId) };
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {
  const { van } = loaderData;

  return <section>{JSON.stringify(van)}</section>;
}
