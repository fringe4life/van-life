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
} from "recharts";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import GenericComponent from "~/components/Container";
import Review from "~/components/Review";
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

  const result = reviews.reduce(
    (acc, cur) => {
      acc[cur.rating as 1 | 2 | 3 | 4 | 5] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  console.log({ user: reviews[0].user.user.name });

  const mappedData = [
    { name: "1 stars", amount: result[1] },
    { name: "2 stars", amount: result[2] },
    { name: "3 stars", amount: result[3] },
    { name: "4 stars", amount: result[4] },
    { name: "5 stars", amount: result[5] },
  ];

  const ratingInStars = reviews.map((review) => new Array(review.rating));

  const reviewItems = reviews.map((review) => ({
    name: review.user.user.name,
    text: review.text,
    rating: review.rating,
    timestamp: review.updatedAt.toLocaleString(),
    id: review.id,
  }));

  const displayReviews = (
    <GenericComponent
      className=""
      Component={Review}
      items={reviewItems}
      renderProps={(item) => item}
      renderKey={(item) => item.id}
    />
  );

  console.log({ reviews });
  return (
    <section>
      <h2 className="">Reviews</h2>
      <BarChart width={730} height={250} data={mappedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
      </BarChart>
      <article>
        <h3 className="text-text text-lg font-bold">
          Reviews ({reviews.length})
        </h3>
        {displayReviews}
      </article>
    </section>
  );
}
