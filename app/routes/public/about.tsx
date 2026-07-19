import { data, href } from "react-router";
import { PendingUI } from "~/components/pending-ui";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { Image } from "~/features/image/component/image";
import {
  ABOUT_IMG,
  ABOUT_IMG_SIZES,
  HIGH_QUALITY_IMAGE_QUALITY,
} from "~/features/image/img-constants";
import { createWebPSrcSet } from "~/features/image/utils/create-optimized-src-set";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { buildAboutPageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import { cn } from "~/utils/utils";
import type { Route } from "./+types/about";

// Create optimized WebP srcSet with 16:9 aspect ratio for both mobile and desktop
// since the about page only uses aspect-video
const srcSet = createWebPSrcSet(ABOUT_IMG, {
  aspectRatio: "16:9",
  quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for about page
  sizes: ABOUT_IMG_SIZES,
});

export const headers = forwardDataHeaders;

export const loader = ({ request }: Route.LoaderArgs) =>
  data(
    { seo: buildAboutPageSeo(request) },
    { headers: PUBLIC_SHORT_CACHE_HEADERS }
  );

const About = ({ loaderData }: Route.ComponentProps) => {
  return (
    <PendingUI
      as="section"
      className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-10"
    >
      <SeoHead {...loaderData.seo} />
      <Image
        alt="a couple enjoying their adventure"
        classesForContainer="full-layout"
        className="xs:mask-[url(/app/assets/cloud-5.svg)] mask-cover mask-no-repeat mask-center aspect-video [view-transition-name:about-image]"
        decoding="sync"
        fetchPriority="high"
        height="890"
        // sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        loading="eager"
        src={ABOUT_IMG}
        srcSet={srcSet}
        width="1600"
      />

      <h2 className="mx-2 font-bold text-2xl starting:opacity-50 duration-1000 sm:mx-4 sm:text-3xl/normal md:text-4xl lg:max-w-3/4">
        Don&apos;t{" "}
        <span className="underline decoration-4 decoration-red-500 underline-offset-2">
          squeeze
        </span>{" "}
        in a sedan when you could{" "}
        <span className="underline decoration-4 decoration-green-500 underline-offset-2">
          relax
        </span>{" "}
        in a van.
      </h2>
      <div className="flex flex-col gap-y-4 starting:opacity-50 duration-1000 md:gap-x-2 lg:flex-row">
        <p className="mx-2 grow basis-1/2 sm:mx-4 sm:text-xl">
          Our mission is to enliven your road trip with the perfect travel van
          rental. Our vans are recertified before each trip to ensure your
          travel plans can go off without a hitch. (Hitch costs extra 😉)
        </p>

        <p className="mx-2 grow basis-1/2 starting:opacity-50 duration-1000 sm:mx-4 sm:text-xl">
          Our team is full of vanlife enthusiasts who know firsthand the magic
          of touring the world on 4 wheels. So dive into our vast catalog today
          and make your own magic in the great outdoors 🌳!
        </p>
      </div>
      <article className="grid max-w-full content-between gap-y-5 rounded-md bg-orange-200 px-4 py-3 sm:px-8 md:max-w-max md:px-12 md:py-6">
        <h3 className="font-bold text-xl xs:text-2xl">
          Your destination is waiting.{" "}
          <span className="block">Your van is ready.</span>
        </h3>
        <CustomLink
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          to={href("/vans")}
        >
          Explore our vans
        </CustomLink>
      </article>
    </PendingUI>
  );
};
export default About;
