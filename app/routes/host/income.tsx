import GenericComponent from "~/components/Container";
import type { Route } from "./+types/income";
import { data } from "react-router";
import { getAccountSummary } from "~/db/getAccountSummary";
import { getHostTransactions } from "~/db/getHostTransactions";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";
import { displayPrice } from "~/lib/displayPrice";
import Income from "~/components/Income";
import type { Decimal } from "@prisma/client/runtime/client";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import useIsNavigating from "~/hooks/useIsNavigating";
import clsx from "clsx";
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

  const hostIncomes = await getHostTransactions(session.user.id);
  return data(
    {
      sumIncome,
      hostIncomes,
    },
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
}

export default function Host({ loaderData }: Route.ComponentProps) {
  const { sumIncome, hostIncomes } = loaderData;

  const mappedData = hostIncomes.map((income) => ({
    name: new Date().getDate().toLocaleString(),
    amount: Math.round(income.amount as unknown as number),
  }));

  const {changingPage} = useIsNavigating()

  return (
    <div className={
      clsx({'opacity-75': changingPage})
    }>
      <h2 className="mb-11 mt-13 text-3xl font-bold">Income</h2>
      <p>
        Last{" "}
        <span className="underline text-text-secondary font-bold">30 days</span>
      </p>
      <p className="text-5xl font-extrabold mt-8 mb-13">
        {displayPrice(sumIncome as unknown as Decimal)}
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={mappedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
        </BarChart>
      </ResponsiveContainer>
      <GenericComponent
        className=" grid-max"
        items={hostIncomes}
        renderKey={(item) => item.id}
        renderProps={(item) => ({
          ...item,
          amount: item.amount as unknown as Decimal,
        })}
        Component={Income}
      />
    </div>
  );
}
