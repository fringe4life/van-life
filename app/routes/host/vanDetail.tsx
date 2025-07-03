import { redirect, data, Link, useOutletContext } from "react-router";
import { getHostVan } from "~/db/getHostVan";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/vanDetail";
import type { Van } from "~/generated/prisma/client";

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
  const session = await auth.api.getSession({ headers: request.headers });
  const { vanId } = params;
  if (!session) throw redirect("/login");
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
export default function VanDetail({ loaderData }: Route.ComponentProps) {
  const context = useOutletContext<Van>();
  console.log(context);
  return (
    <section>
      <Link to=".." relative="path">
        &larr; Back to all vans
      </Link>
    </section>
  );
}
