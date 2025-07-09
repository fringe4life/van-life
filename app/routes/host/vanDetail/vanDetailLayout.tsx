import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/vanDetailLayout";
import { data, redirect, Outlet, Link } from "react-router";
import { getHostVan } from "~/db/getHostVan";
import VanDetailCard from "~/cards/van-detail-card";
import useIsNavigating from "~/hooks/useIsNavigating";
import clsx from "clsx";

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

export default function VanDetailLayout({ loaderData }: Route.ComponentProps) {
  const { van } = loaderData;
  const { changingPage } = useIsNavigating();
  return (
    <>
      <Link to=".." relative="path" className="mt-15 mb-8">
        &larr; Back to all vans
      </Link>
      <VanDetailCard van={van}>
        <div
          className={clsx({
            "opacity-50": changingPage,
          })}
        >
          <Outlet context={van} />
        </div>
      </VanDetailCard>
    </>
  );
}
