import { redirect, data } from "react-router";
import { getHostVan } from "~/db/getHostVan";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/vanDetail";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.van) {
    throw redirect("/notfound");
  }
  return [
    { title: `${data.van.name} | Vanlife` },
    {
      name: "details",
      content: `The details about ${data.van.name}`,
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  const { vanId } = params;
  if (!session) throw redirect("login");
  if (!vanId) throw redirect("/notfound");
  const van = await getHostVan(session.user.id, vanId);

  return data(
    {
      van,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function VanDetail({ loaderData }: Route.ComponentProps) {}
