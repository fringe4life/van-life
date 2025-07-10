import { data, href, Link } from "react-router";
import type { Route } from "./+types/host";
import { getHostVans } from "~/db/getHostVans";
import VanCard from "~/cards/van-card";
import { getAccountSummary } from "~/db/getAccountSummary";
import { getAverageReviewRating } from "~/db/getAvgReviews";
import GenericComponent from "~/components/Container";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import clsx from "clsx";
import useIsNavigating from "~/hooks/useIsNavigating";
import { displayPrice } from "~/lib/displayPrice";

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
  const session = await getSessionOrRedirect(request);
  const vans = await getHostVans(session.user.id, 1, 3);

  const sumIncome = await getAccountSummary(session.user.id);

  const avgRating = await getAverageReviewRating(session.user.id);

  return data(
    {
      vans,
      sumIncome,
      avgRating,
      name: session.user.name,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { vans, sumIncome, avgRating, name } = loaderData;

  const { changingPage } = useIsNavigating();
  return (
    <section>
      <div className="bg-orange-100 py-9 px-6.5 grid justify-between items-center grid-cols-[auto_fit-content]">
        <h2 className="col-start-1 font-bold text-4xl text-text">
          Welcome {name ? name : "User"}!
        </h2>
        <p className="col-start-1 my-8 text-base text-text-secondary font-light">
          Income last <span className="underline font-medium">30 days</span>
        </p>
        <p className="col-start-1 font-extrabold text-5xl text-text">
          {displayPrice(sumIncome)}
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
      <GenericComponent
        items={vans}
        Component={VanCard}
        className={clsx({
          "space-y-6": true,
          "opacity-75": changingPage,
        })}
        renderKey={(item) => item.id}
        renderProps={(item) => ({
          van: item,
          link: href("/host/vans/:vanId", { vanId: item.id }),
          action: <p></p>,
        })}
      />
    </section>
  );
}
