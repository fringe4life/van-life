import { data, Link, href, useSearchParams } from "react-router";
import { getHostVans } from "~/db/getHostVans";
import type { Route } from "./+types/hostVans";
import VanCard from "~/cards/van-card";
import { getPaginationParams } from "~/lib/getPaginationParams";
import { getHostVanCount } from "~/db/getHostVanCount";
import { getParamsClientSide } from "~/lib/getParamsClientSide";
import GenericComponent from "~/components/Container";
import Pagination from "~/components/Pagination";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import useIsNavigating from "~/hooks/useIsNavigating";
import clsx from "clsx";

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

  const { changingPage } = useIsNavigating();

  const [searchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { page, limit } = getParamsClientSide(searchParams);

  return (
    <section>
      <h2 className="font-bold text-4xl mt-13.5 mb-8 text-text">
        Your listed vans
      </h2>
      <GenericComponent
        className={clsx({
          "space-y-6 mt-6": true,
          "opacity-75": changingPage,
        })}
        Component={VanCard}
        items={vans}
        renderKey={(van) => van.id}
        renderProps={(van) => ({
          link: href("/host/vans/:vanId", { vanId: van.id }),
          van,
          action: (
            <Link to={href("/host/vans/:vanId", { vanId: van.id })}>Edit</Link>
          ),
        })}
      />
      <Pagination
        pathname={href("/host/vans")}
        itemsCount={vansCount}
        limit={limit}
        page={page}
        typeFilter={undefined}
      />
    </section>
  );
}
