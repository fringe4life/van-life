import { getVans } from "~/db/getVans";

import { Type as VanTypes } from "~/generated/prisma/enums";
import type { Route } from "./+types/vans";
import { data, href, Link, NavLink, useSearchParams } from "react-router";
import { Badge, badgeVariants } from "~/components/ui/badge";
import Van from "~/components/Van";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Vanlife" },
    {
      name: "description",
      content: "About us",
    },
  ];
}

export async function loader() {
  const badges = Object.values(VanTypes);
  return data(
    { vans: await getVans(), badges },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Vans({ loaderData }: Route.ComponentProps) {
  const { vans, badges } = loaderData;

  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");
  const vansList = typeFilter
    ? vans.filter((van) => van.type === typeFilter.toUpperCase())
    : vans;
  const vansToDisplay = vansList.map((van) => (
    <Van van={van} filter={typeFilter} />
  ));

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
    <section className="grid-max mb-20">
      <div className="col-span-full">
        <h2 className="text-3xl font-bold mb-5.75 text-balance">
          Explore our van options
        </h2>
        <p className="flex justify-between md:justify-start md:gap-6">
          {filtersToDisplay}{" "}
          <Link className="hover:underline" to={href("/vans")}>
            Clear filters
          </Link>
        </p>
      </div>
      {vansToDisplay}
    </section>
  );
}
