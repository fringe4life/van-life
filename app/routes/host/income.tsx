import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/income";
import { data, href, redirect } from "react-router";
import { getAccountSummary } from "~/db/getAccountSummary";

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
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(href("/login"));

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
  return <div>{((sumIncome as number) ?? 0).toFixed(2)}</div>;
}
