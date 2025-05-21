import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import home from "../assets/home.png";
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
  console.log(home);
  return (
    <section
      className={`bg-[url(/app/assets/home.png)] grid gap-6 text-white bg-cover w-full min-h-90 px-7 py-15`}
    >
      <h2 className="text-4xl font-extrabold text-shadow-accent text-balance">
        You got the travel plans, we got the travel vans.
      </h2>
      <p className="text-shadow-2xs text-pretty max-w-[45ch]">
        Add adventure to your life by joining the #vanlife movement. Rent the
        perfect van to make your perfect road trip.
      </p>
      <Button
        variant="default"
        className="self-end max-w-[80ch] sm:justify-self-center"
      >
        Find your van
      </Button>
    </section>
  );
}
