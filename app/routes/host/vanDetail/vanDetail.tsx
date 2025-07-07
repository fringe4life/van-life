import { redirect, data, Link, useOutletContext } from "react-router";
import { getHostVan } from "~/db/getHostVan";
import type { Route } from "./+types/vanDetail";
import type { Van } from "~/generated/prisma/client";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";

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
  const context = useOutletContext<Van>();
  console.log({ context });
  return (
    <section>
      <Link to=".." relative="path">
        &larr; Back to all vans
      </Link>
    </section>
  );
}
