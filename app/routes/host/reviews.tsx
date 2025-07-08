import type { Route } from "./+types/reviews";
import { data } from "react-router";
import { getHostReviews } from "~/db/getHostReviews";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import GenericComponent from "~/components/Container";
import Review from "~/components/Review";
import clsx from "clsx";
import useIsNavigating from "~/hooks/useIsNavigating";
export function meta(_: Route.MetaArgs) {
  return [
    { title: "Reviews | Vanlife" },
    {
      name: "description",
      content: "The Reviews you have received",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionOrRedirect(request);

  const reviews = await getHostReviews(session.user.id);
  return data(
    {
      reviews,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { reviews } = loaderData;

  const { changingPage } = useIsNavigating();

  const result = reviews.reduce(
    (acc, cur) => {
      acc[cur.rating as 1 | 2 | 3 | 4 | 5] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  const mappedData = [
    { name: "1 stars", amount: result[1] },
    { name: "2 stars", amount: result[2] },
    { name: "3 stars", amount: result[3] },
    { name: "4 stars", amount: result[4] },
    { name: "5 stars", amount: result[5] },
  ];

  const reviewItems = reviews.map((review) => ({
    name: review.user.user.name,
    text: review.text,
    rating: review.rating,
    timestamp: review.updatedAt?.toLocaleString() ?? "unknown",
    id: review.id,
  }));

  console.log({ reviews });
  return (
    <section
      className={clsx({
        "opacity-75": changingPage,
      })}
    >
      <h3 className="">Reviews</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={mappedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
        </BarChart>
      </ResponsiveContainer>
      <article>
        <h3 className="text-text text-lg font-bold">
          Reviews ({reviews.length})
        </h3>
        <GenericComponent
          className="space-y-6"
          Component={Review}
          items={reviewItems}
          renderProps={(item) => item}
          renderKey={(item) => item.id}
        />
      </article>
    </section>
  );
}
