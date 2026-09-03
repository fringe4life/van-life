import { data, href } from "react-router";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { Image } from "~/components/image/image";
import { HIGH_QUALITY_IMAGE_QUALITY } from "~/components/image/img-constants";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { buildAboutPageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import { fullBleed } from "~/styles";
import { css, cx } from "../../../styled-system/css";
import { flex, grid } from "../../../styled-system/patterns";

import type { Route } from "./+types/about";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1503516353893-4bc5bd56f50d?w=1000&q=80&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbXBlcnZhbnxlbnwwfDB8MHx8fDI%3D";

const ABOUT_IMG_SIZES = [300, 450, 600, 750, 1000] as const;

// Create optimized WebP srcSet with 16:9 aspect ratio for both mobile and desktop
const srcSet = createWebPSrcSet(ABOUT_IMG, {
  aspectRatio: "16:9",
  quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for about page
  sizes: ABOUT_IMG_SIZES,
});

export const headers = forwardDataHeaders;

export const loader = ({ request }: Route.LoaderArgs) =>
  data(
    { seo: buildAboutPageSeo(request, ABOUT_IMG) },
    { headers: PUBLIC_SHORT_CACHE_HEADERS }
  );

const About = ({ loaderData }: Route.ComponentProps) => (
  <PendingUI
    as="section"
    className={cx(
      grid({
        gap: { base: "4", md: "10", sm: "6" },
        inlineSize: "full",
        marginInline: "auto",
        maxInlineSize: "content",
      })
    )}
  >
    <SeoHead {...loaderData.seo} />
    <Image
      alt="a couple enjoying their adventure"
      className={css({
        aspectRatio: "video",
        maskImage: { xs: "url(/cloud-5.svg)" },
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "cover",
        viewTransitionName: "about-image",
      })}
      decoding="sync"
      fetchPriority="high"
      height="890"
      loading="eager"
      pictureClassName={fullBleed}
      src={ABOUT_IMG}
      srcSet={srcSet}
      width="1600"
    />

    <h2
      className={css({
        fontSize: { base: "2xl", md: "4xl", sm: "3xl" },
        fontWeight: "bold",
        lineHeight: { base: "8", md: "10", sm: "normal" },
        marginInline: { base: "2", sm: "4" },
        maxInlineSize: { lg: "3/4" },
      })}
    >
      Don&apos;t{" "}
      <span
        className={css({
          textDecoration: "underline",
          textDecorationColor: "destructive",
          textDecorationThickness: "4",
          textUnderlineOffset: "2",
        })}
      >
        squeeze
      </span>{" "}
      in a sedan when you could{" "}
      <span
        className={css({
          textDecoration: "underline",
          textDecorationColor: "success",
          textDecorationThickness: "4",
          textUnderlineOffset: "2",
        })}
      >
        relax
      </span>{" "}
      in a van.
    </h2>

    <div
      className={flex({
        direction: { base: "column", lg: "row" },
        gap: { base: "4", md: "2" },
      })}
    >
      <p
        className={css({
          flexBasis: "1/2",
          flexGrow: 1,
          fontSize: { sm: "xl" },
          marginInline: { base: "2", sm: "4" },
        })}
      >
        Our mission is to enliven your road trip with the perfect travel van
        rental. Our vans are recertified before each trip to ensure your travel
        plans can go off without a hitch. (Hitch costs extra 😉)
      </p>

      <p
        className={css({
          flexBasis: "1/2",
          flexGrow: 1,
          fontSize: { sm: "xl" },
          marginInline: { base: "2", sm: "4" },
        })}
      >
        Our team is full of vanlife enthusiasts who know firsthand the magic of
        touring the world on 4 wheels. So dive into our vast catalog today and
        make your own magic in the great outdoors 🌳!
      </p>
    </div>

    <article
      className={grid({
        alignContent: "space-between",
        backgroundColor: "surface.accent",
        borderRadius: "md",
        gap: { base: "5", md: "6" },
        maxInlineSize: { base: "full", md: "max-content" },
        paddingBlock: { base: "3", md: "6" },
        paddingInline: { base: "4", md: "12", sm: "8" },
      })}
    >
      <h3
        className={css({
          fontSize: { base: "xl", xs: "2xl" },
          fontWeight: "bold",
        })}
      >
        Your destination is waiting.{" "}
        <span className="block">Your van is ready.</span>
      </h3>
      <CustomLink
        className={cx(
          buttonVariants({ variant: "secondary" }),
          css({ inlineSize: "full" })
        )}
        to={href("/vans")}
      >
        Explore our vans
      </CustomLink>
    </article>
  </PendingUI>
);
export default About;
