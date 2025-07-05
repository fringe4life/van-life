import { redirect, data, Link, href } from "react-router";
import { getHostVans } from "~/db/getHostVans";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/hostVans";
import VanCard from "~/cards/van-card";

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
  const vans = await getHostVans(session.user.id);

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
{
  /* <p className="justify-self-end">{price}</p>; */
}
export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans } = loaderData;

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
