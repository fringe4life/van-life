import { redirect, data, Link, href, useSearchParams } from "react-router";
import { getHostVans } from "~/db/getHostVans";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/hostVans";
import VanCard from "~/cards/van-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "~/components/ui/pagination";

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

  const url = new URLSearchParams(request.url.split("?")?.[1] ?? "");
  console.log({ url, page: url.get("page") });

  const page = Number.parseInt(url.get("page") ?? "1");
  const limit = Number.parseInt(url.get("limit") ?? "1");
  const vans = await getHostVans(session.user.id, page, limit);

  return data(
    {
      vans,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans } = loaderData;

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

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
    </section>
  );
}
