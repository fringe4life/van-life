import type { Route } from "./+types/income";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Host Income | Vanlife" },
    {
      name: "income",
      content: "Income from vans rented to others",
    },
  ];
}

export default function Host() {
  return <div>Income</div>;
}
