import type { Route } from "./+types/home";
import { buttonVariants } from "~/components/ui/button";
import { href, Link } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Van life" },
    {
      name: "description",
      content:
        "Welcome to Van life, a site to help you find your next Camper Van!",
    },
  ];
}

export default function Home() {
  return (
    <section className="[view-transition-name:image] bg-[url(/app/assets/home.png)] mask-[url(/app/assets/rvMask.svg)] mask-center md:mask-right mask-add mask-no-repeat mask-cover grid gap-6 text-white bg-cover  place-content-center">
      <h2 className="text-2xl md:text-4xl font-extrabold text-shadow-md text-balance max-w-[26ch]">
        You got the travel plans, we've got the travel vans.
      </h2>
      <p className="text-shadow-2xs text-pretty max-w-[26ch] md:max-w-[45ch]">
        Add adventure to your life by joining the #vanlife movement. Rent the
        perfect van to make your perfect road trip.
      </p>
      <Link
        to={href("/vans")}
        className={buttonVariants({ variant: "default" })}
      >
        Find your van
      </Link>
    </section>
  );
}
// "self-end max-w-[80ch] sm:justify-self-center"
