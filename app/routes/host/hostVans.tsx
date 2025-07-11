import { data, Link, href } from "react-router";
import { getHostVans } from "~/db/getHostVans";
import type { Route } from "./+types/hostVans";
import VanCard from "~/components/cards/van-card";
import { getPaginationParams } from "~/utils/getPaginationParams";
import { getHostVanCount } from "~/db/getHostVanCount";

import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";

import VanPages from "~/components/VanPages";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Host Vans | Vanlife" },
    {
      name: "description",
      content: "the dashboard page whe you are logged in",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionOrRedirect(request);

  const { page, limit } = getPaginationParams(request.url);
  const vans = await getHostVans(session.user.id, page, limit);
  const vansCount = await getHostVanCount(session.user.id);

  return data(
    {
      vans,
      vansCount,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans, vansCount } = loaderData;

  return (
    <VanPages
      // generic component props
      className=""
      Component={VanCard}
      renderKey={(van) => van.id}
      renderProps={(van) => ({
        link: href("/host/vans/:vanId", { vanId: van.id }),
        van,
        action: (
          <Link to={href("/host/vans/:vanId", { vanId: van.id })}>Edit</Link>
        ),
      })}
      items={vans}
      itemsCount={vansCount}
      // generic component props end
      // used for discriminated union in case needed
      variant="host"
      // props for all use cases
      path={href("/host/vans")}
      title="Explore our van options"
    />
  );
}
