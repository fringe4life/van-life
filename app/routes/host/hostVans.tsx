import { redirect, data, Link } from "react-router";
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

export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans } = loaderData;

  const vansToDisplay = vans.map((van) => <VanCard key={van.id} {...van} />);

  return (
    <section>
      <div className="bg-orange-100 py-9 px-6.5 grid justify-between items-center grid-cols-[auto_fit-content]">
        <h2 className="col-start-1 font-bold text-4xl text-text">Welcome!</h2>
        <p className="col-start-1 my-8 text-base text-text-secondary font-light">
          Income last <span className="underline font-medium">30 days</span>
        </p>
        <p className="col-start-1 font-extrabold text-5xl text-text">$2,260</p>
        <Link to="income" className="col-start-2 row-start-2">
          Details
        </Link>
      </div>
      <div className="flex justify-between py-11 px-6.5 ">
        <p className="text-2xl font-bold text-shadow-text">
          Review Score star 5.0/5
        </p>
        <Link to="reviews" className="text-base font-medium text-shadow-text">
          Details
        </Link>
      </div>
      {vansToDisplay}
    </section>
  );
}
