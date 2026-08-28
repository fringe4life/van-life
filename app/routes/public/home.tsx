import { data, href } from "react-router";
import { PendingUI } from "~/components/pending-ui";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { Image } from "~/features/image/component/image";
import {
  HIGH_QUALITY_IMAGE_QUALITY,
  HOME_DESKTOP_IMG_SIZES,
  HOME_IMG_URL,
  HOME_MOBILE_IMG_SIZES,
} from "~/features/image/img-constants";
import { createWebPSrcSet } from "~/features/image/utils/create-optimized-src-set";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { buildHomePageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import { cn } from "~/utils/utils";
import type { Route } from "./+types/home";

// Art-direct portrait and landscape crops independently so the mask and hero
// layout always receive the intended aspect ratio at each breakpoint.
const mobileSrcSet = createWebPSrcSet(HOME_IMG_URL, {
  aspectRatio: "2:3",
  quality: HIGH_QUALITY_IMAGE_QUALITY,
  sizes: HOME_MOBILE_IMG_SIZES,
});
const desktopSrcSet = createWebPSrcSet(HOME_IMG_URL, {
  aspectRatio: "16:9",
  quality: HIGH_QUALITY_IMAGE_QUALITY,
  sizes: HOME_DESKTOP_IMG_SIZES,
});
const sizes = "100vw";

export const headers = forwardDataHeaders;

export const loader = ({ request }: Route.LoaderArgs) =>
  data(
    { seo: buildHomePageSeo(request) },
    { headers: PUBLIC_SHORT_CACHE_HEADERS }
  );

const Home = ({ loaderData }: Route.ComponentProps) => {
  return (
    <PendingUI
      as="section"
      className="full-layout relative grid aspect-1/1.5 h-full text-white contain-strict sm:pl-6 md:aspect-video md:place-content-center md:self-center"
    >
      <SeoHead {...loaderData.seo} />
      {/* Background Image with gradient overlay */}
      <div className="mask-cover mask-no-repeat mask-right md:mask-[url(/rvMask.min.svg)] absolute inset-0">
        <div className="absolute inset-0 z-10 bg-linear-45 from-0% from-indigo-300/40 via-33% via-green-300/40 to-66% to-yellow-200/40 bg-blend-darken" />
        <Image
          alt="Camper van on scenic road"
          className="w-full [view-transition-name:home-image]"
          decoding="sync"
          fetchPriority="high"
          height={900}
          loading="eager"
          pictureClassName="absolute inset-0 w-full h-full"
          sizes={sizes}
          sources={[
            {
              media: "(max-width: 767px)",
              sizes,
              srcSet: mobileSrcSet,
              type: "image/webp",
            },
            {
              media: "(min-width: 768px)",
              sizes,
              srcSet: desktopSrcSet,
              type: "image/webp",
            },
          ]}
          src={HOME_IMG_URL}
          srcSet={desktopSrcSet}
          width={1600}
        />
      </div>

      {/* Content overlay */}
      <div className="z-20 grid content-center gap-y-6 px-(--padding-inline) md:justify-center md:px-0">
        <h2 className="max-w-[20ch] p-1 font-extrabold text-2xl text-shadow-lg xs:text-3xl backdrop-blur-sm md:text-4xl">
          You got the travel plans, we got the travel vans.
        </h2>
        <p className="max-w-[34ch] xs:max-w-[42.5ch] p-1 text-shadow-sm backdrop-blur-xs">
          Add adventure to your life by joining the #vanlife movement. Rent the
          perfect van to make your perfect road trip.
        </p>
        <CustomLink
          className={cn(buttonVariants({ size: "lg" }), "max-w-[42.5ch]")}
          to={href("/vans")}
        >
          Find your van
        </CustomLink>
      </div>
    </PendingUI>
  );
};
export default Home;
