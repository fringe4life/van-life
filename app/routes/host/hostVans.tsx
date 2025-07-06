import { redirect, data, Link, href, useSearchParams } from "react-router";
import { getHostVans } from "~/db/getHostVans";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/hostVans";
import VanCard from "~/cards/van-card";
import { getPaginationParams } from "~/lib/getPaginationParams";
import { getHostVanCount } from "~/db/getHostVanCount";
import { badgeVariants } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";

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
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect("login");

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

  const [searchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const limit = Number.parseInt(searchParams.get("limit") ?? "10");
  const page = Number.parseInt(searchParams.get("page") ?? "1");
  const hasPagesOfVans = vansCount > vans.length;
  let numberOfPages = 1;
  let listOfLinks = [];
  if (hasPagesOfVans) {
    numberOfPages = Math.ceil(vansCount / limit);
  }
  for (let i = 0; i < numberOfPages; i++) {
    listOfLinks.push(
      <Link
        key={i}
        className={buttonVariants({
          variant: page === i + 1 ? "link" : "outline",
        })}
        to={{
          pathname: href("/host/vans"),
          search: `?page=${i + 1}&limit=${limit}`,
        }}
      ></Link>
    );
  }
  console.log({ vansCount, vansLenght: vans.length });
  const vansToDisplay = vans.map((van) => (
    <VanCard
      key={van.id}
      van={van}
      link={href("/host/vans/:vanId", { vanId: van.id })}
      action={
        <Link to={href("/host/vans/:vanId", { vanId: van.id })}>Edit</Link>
      }
    />
  ));

  return (
    <section>
      <h2 className="font-bold text-4xl mt-13.5 mb-8 text-text">
        Your listed vans
      </h2>
      {vansToDisplay}
      {listOfLinks}
    </section>
  );
}
