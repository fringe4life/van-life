import type { Route } from "./+types/income";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Vanlife" },
    {
      name: "description",
      content: "About us",
    },
  ];
}

export default function Host() {
  return <div>Income</div>;
}
