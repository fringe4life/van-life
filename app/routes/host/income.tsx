import type { Route } from "./+types/income";
import { data } from "react-router";
import { getAccountSummary } from "~/db/getAccountSummary";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import { displayPrice } from "~/lib/displayPrice";
export function meta(_: Route.MetaArgs) {
  return [
    { title: "Your Income | Vanlife" },
    {
      name: "income",
      content: "Income from vans rented to others",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionOrRedirect(request);

  const sumIncome = await getAccountSummary(session.user.id);

  return data(
    {
      sumIncome,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { sumIncome } = loaderData;
  return <div>{displayPrice(sumIncome)}</div>;
}
