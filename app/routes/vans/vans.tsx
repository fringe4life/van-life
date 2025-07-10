import { getVans } from "~/db/getVans";

import { VanType } from "~/generated/prisma/enums";

import { data, href, Link, NavLink, useSearchParams } from "react-router";
import { badgeVariants } from "~/components/ui/badge";
import Van from "~/components/Van";
import type { Route } from "./+types/vans";
import { getPaginationParams } from "~/utils/getPaginationParams";
import { getVansCount } from "~/db/getVansCount";
import { getParamsClientSide } from "~/utils/getParamsClientSide";
import GenericComponent from "~/components/Container";
import Pagination from "~/components/Pagination";
import useIsNavigating from "~/hooks/useIsNavigating";
import clsx from "clsx";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Vans | Vanlife" },
    {
      name: "description",
      content: "Browse our vans for rent",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const badges = Object.values(VanType);

  const { page, limit, typeFilter } = getPaginationParams(request.url);

  const vans = await getVans(page, limit, typeFilter.toUpperCase() as VanType);
  const vansCount = await getVansCount(typeFilter.toUpperCase() as VanType);
  return data(
    { vans, badges, vansCount },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Vans({ loaderData }: Route.ComponentProps) {
  const { vans, badges, vansCount } = loaderData;

  const [searchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });
  const { page, limit, typeFilter } = getParamsClientSide(searchParams);

  const { changingPage } = useIsNavigating();

  const vansList = typeFilter
    ? vans.filter((van) => van.type === typeFilter.toUpperCase())
    : vans;

  const filtersToDisplay = badges.map((type) => {
    const lowerCaseType = type.toLowerCase();
    const variant = typeFilter === type.toLowerCase() ? type : "OUTLINE";
    return (
      <NavLink
        key={lowerCaseType}
        to={{
          search: `?type=${lowerCaseType}`,
        }}
        className={badgeVariants({ variant })}
        viewTransition
      >
        {type}
      </NavLink>
    );
  });

  return (
    <section className=" mb-20">
      <div>
        <h2 className="text-3xl font-bold mb-5.75 text-balance">
          Explore our van options
        </h2>
        <p className="flex justify-between md:justify-start md:gap-6 mb-6">
          {filtersToDisplay}{" "}
          <Link className="hover:underline" to={href("/vans")}>
            Clear filters
          </Link>
        </p>
      </div>
      <GenericComponent
        className={clsx({
          "grid-max mt-6": true,
          "opacity-75": changingPage,
        })}
        Component={Van}
        items={vansList}
        renderKey={(van) => van.id}
        renderProps={(van) => ({
          van,
          filter: typeFilter,
        })}
      />
      <Pagination
        itemsCount={vansCount}
        limit={limit}
        page={page}
        typeFilter={typeFilter}
        pathname={href("/vans")}
      />
    </section>
  );
}
