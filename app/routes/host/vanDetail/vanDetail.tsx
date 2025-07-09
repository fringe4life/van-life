import { redirect, data, Link, useOutletContext, Outlet } from "react-router";
import { getHostVan } from "~/db/getHostVan";
import type { Route } from "./+types/vanDetail";
import type { Van } from "~/generated/prisma/client";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import { capitalize } from "~/lib/utils";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.van?.name ?? "unknown"} | Vanlife` },
    {
      name: "details",
      content: `The details about ${data?.van?.name ?? "unknown"} van`,
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSessionOrRedirect(request);
  const { vanId } = params;
  if (!vanId) throw redirect("/notfound");
  const van = await getHostVan(session.user.id, vanId);
  if (!van) throw redirect("/notfound");

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
export default function VanDetail({}: Route.ComponentProps) {
  const van = useOutletContext<Van>();
  return (
    <article>
      <p className="font-bold">
        Name: <span className="font-normal">{van.name}</span>
      </p>
      <p className="font-bold my-4">
        Category: <span className="font-normal">{capitalize(van.type)}</span>
      </p>
      <p className="font-bold min-w-full max-w-3xs">
        Description: <span className="font-normal">{van.description}</span>
      </p>
    </article>
  );
}
