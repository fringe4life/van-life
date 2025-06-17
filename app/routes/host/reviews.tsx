import type { Route } from "./+types/host";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Reviews | Vanlife" },
    {
      name: "description",
      content: "the dashboard page whe you are logged in",
    },
  ];
}

export default function Host() {
  return <section>Reviews</section>;
}
