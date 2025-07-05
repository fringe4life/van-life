import { data, href, Link, redirect } from "react-router";
import type { Route } from "./+types/host";
import { auth } from "~/lib/auth/auth";
import { getHostVans } from "~/db/getHostVans";
import VanCard from "~/cards/van-card";
import { getAccountSummary } from "~/db/getAccountSummary";
import { getAverageReviewRating } from "~/db/getAvgReviews";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Host | Vanlife" },
    {
      name: "description",
      content: "the dashboard page when you are logged in",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect("login");
  const vans = await getHostVans(session.user.id);

  const sumIncome = await getAccountSummary(session.user.id);

  const avgRating = await getAverageReviewRating(session.user.id);

  return data(
    {
      vans,
      sumIncome,
      avgRating,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans, sumIncome, avgRating } = loaderData;

  const vansToDisplay = vans
    .filter((_, index) => index < 4)
    .map((van) => <VanCard key={van.id} van={van} link={ href('/host/vans/:vanId', {vanId: van.id})} action={<p></p>} />);

  return (
    <section>
      <div className="bg-orange-100 py-9 px-6.5 grid justify-between items-center grid-cols-[auto_fit-content]">
        <h2 className="col-start-1 font-bold text-4xl text-text">Welcome!</h2>
        <p className="col-start-1 my-8 text-base text-text-secondary font-light">
          Income last <span className="underline font-medium">30 days</span>
        </p>
        <p className="col-start-1 font-extrabold text-5xl text-text">
          {((sumIncome as number) ?? 0).toFixed(2)}
        </p>
        <Link to={href("/host/income")} className="col-start-2 row-start-2">
          Details
        </Link>
      </div>
      <div className="flex justify-between py-11 px-6.5 ">
        <p className="text-2xl font-bold text-shadow-text">
          Review Score star {avgRating.toFixed(1)}/5
        </p>
        <Link
          to={href("/host/review")}
          className="text-base font-medium text-shadow-text"
        >
          Details
        </Link>
      </div>
      {vansToDisplay}
    </section>
  );
}
