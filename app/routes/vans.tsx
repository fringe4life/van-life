import { getVans } from "~/db/getVans";

import { Type as VanTypes } from "../generated/prisma";
import type { Route } from "../routes/+types/vans";
import VanCard from "../van/van-card";
import { Link, useSearchParams } from "react-router";
import { badgeVariants } from "~/components/ui/badge";
export async function loader() {
  return { vans: await getVans() };
}

export default function Vans({ loaderData }: Route.ComponentProps) {
  const { vans } = loaderData;
  const badges = Object.values(VanTypes);

  const [searchParams, setSearchParams] = useSearchParams();

  const typeFilter = searchParams.get("type");
  console.log(typeFilter);
  const vansToDisplay = vans.map((van) => <VanCard key={van.id} {...van} />);

  const filtersToDisplay = badges.map((type, index) => (
    <Link
      key={index}
      to={{
        search: `?type=${type.toLowerCase()}`,
      }}
      className={badgeVariants({ variant: "default" })}
    >
      {type}
    </Link>
  ));

  return (
    <section className="grid-max">
      <div className="col-span-full">
        <h2>Explore our van options</h2>
        <p>{filtersToDisplay}</p>
      </div>
      {vansToDisplay}
    </section>
  );
}
