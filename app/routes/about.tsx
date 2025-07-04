import aboutImg from "../assets/about.png";
import largeImage from "../assets/about-large.jpg";
import type { Route } from "./+types/about";
import { href, Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Available Vans" },
    {
      name: "description",
      content: "Browse the Vans available for hire",
    },
  ];
}

export default function About() {
  return (
    <section className="grid gap-4 grid-rows-[auto_auto_auto_auto] grid-cols-[1fr]">
      <img
        className="object-cover aspect-video h-auto md:aspect-4/1"
        src={largeImage}
        alt="a person sitting on top of their camper van"
      />
      <h2 className="text-3xl/normal font-bold text-balance mx-4 lg:max-w-1/2 lg:mx-auto">
        Don&apos;t{" "}
        <span className="relative  after:absolute after:border-solid after:-bottom-1 after:w-full after:left-0  after:border-2 after:border-b-red-500 after:rounded-lg ">
          squeeze
        </span>{" "}
        in a sedan when you could{" "}
        <span className="relative after:border-double  after:absolute after:-bottom-1 after:w-full after:left-0  after:border-2 after:border-b-green-500 after:rounded-lg ">
          relax
        </span>{" "}
        in a van.
      </h2>

      <p className="lg:mx-auto lg:max-w-1/2 mx-4">
        Our mission is to enliven your road trip with the perfect travel van
        rental. Our vans are recertified before each trip to ensure your travel
        plans can go off without a hitch. (Hitch costs extra 😉)
      </p>
      <p className="lg:mx-auto lg:max-w-1/2 mx-4">
        Our team is full of vanlife enthusiasts who know firsthand the magic of
        touring the world on 4 wheels.
      </p>
      <article className="bg-[#FFCC8D] py-7.5 px-9 mx-4 my-14 lg:mx-auto lg:max-w-1/2 rounded-md">
        <h3 className="text-2xl font-bold text-balance mb-6">
          Your destination is waiting. Your van is ready.
        </h3>
        <Link
          to={href("/vans")}
          className={buttonVariants({ variant: "secondary" })}
        >
          Explore our vans
        </Link>
      </article>
    </section>
  );
}

// Photo by <a href="https://unsplash.com/@leon_bublitz?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Leon Bublitz</a> on <a href="https://unsplash.com/photos/white-bus-near-ocean-M-p2YHj3sjk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
