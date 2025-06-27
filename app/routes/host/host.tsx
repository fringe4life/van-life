import { Link } from "react-router";
import type { Route } from "./+types/host";
import { auth } from "~/lib/auth/auth";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Host | Vanlife" },
    {
      name: "description",
      content: "the dashboard page whe you are logged in",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers })
  
}

export default function Host() {
  return (
    <section>
      <div className="bg-orange-100 py-9 px-6.5 grid justify-between items-center grid-cols-[auto_fit-content]">
        <h2 className="col-start-1 font-bold text-4xl text-text">Welcome!</h2>
        <p className="col-start-1 text-base text-text-secondary font-light">
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
    </section>
  );
}
