import aboutImg from "../assets/about.png";
import largeImage from "../assets/about-large.jpg";
export default function About() {
  return (
    <section className="grid gap-4 grid-rows-[auto_auto_auto_auto] grid-cols-[1fr]">
      <img
        className="object-cover aspect-video h-auto md:aspect-4/1"
        src={largeImage}
        alt="a person sitting on top of their camper van"
      />
      <h2 className="text-3xl/normal font-bold text-balance ">
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

      <p className="lg:max-w-1/2">
        Our mission is to enliven your road trip with the perfect travel van
        rental. Our vans are recertified before each trip to ensure your travel
        plans can go off without a hitch. (Hitch costs extra 😉)
      </p>
      <p className="lg:max-w-1/2 lg:ml-auto">
        Our team is full of vanlife enthusiasts who know firsthand the magic of
        touring the world on 4 wheels.
      </p>
    </section>
  );
}

// Photo by <a href="https://unsplash.com/@leon_bublitz?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Leon Bublitz</a> on <a href="https://unsplash.com/photos/white-bus-near-ocean-M-p2YHj3sjk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
