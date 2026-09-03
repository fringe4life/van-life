import { data, href } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
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
import { buildHomePageSeo } from "~/features/seo/build-page-seo.server";
import { SeoHead } from "~/features/seo/seo-head";
import { fullLayout } from "~/styles";

import type { Route } from "./+types/home";

const HOME_IMG_URL =
  "https://images.unsplash.com/photo-1671783181591-55f8e18fbb21?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtcGVydmFuJTIwc2l0ZXxlbnwwfDB8MHx8fDI%3D";

const HOME_MOBILE_IMG_SIZES = [300, 450, 600, 750] as const;
const HOME_DESKTOP_IMG_SIZES = [800, 1000, 1200, 1400] as const;

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
    { seo: buildHomePageSeo(request, HOME_IMG_URL) },
    { headers: PUBLIC_SHORT_CACHE_HEADERS }
  );

const Home = ({ loaderData }: Route.ComponentProps) => (
  <PendingUI
    as="section"
    className={cx(
      grid({
        aspectRatio: { base: "1/1.5", md: "video" },
        gap: "0",
        justifySelf: "center",
        paddingInlineStart: { md: "6" },
        placeContent: { md: "center" },
      }),
      css({
        blockSize: "full",
        color: "on-image",
        contain: "strict",
        marginInline: "auto",
        position: "relative",
      }),
      fullLayout
    )}
  >
    <SeoHead {...loaderData.seo} />
    {/* Background Image with gradient overlay */}
    <div
      className={css({
        inset: 0,
        maskImage: { md: "url(/rvMask.min.svg)" },
        maskPosition: "right",
        maskRepeat: "no-repeat",
        maskSize: "cover",
        position: "absolute",
      })}
    >
      <div
        className={css({
          backgroundBlendMode: "darken",
          bgLinear: "to-br",
          gradientFrom: "indigo.300/40",
          gradientFromPosition: "0%",
          gradientTo: "yellow.200/40",
          gradientToPosition: "66%",
          gradientVia: "green.300/40",
          gradientViaPosition: "33%",
          inset: 0,
          position: "absolute",
          zIndex: 10,
        })}
      />
      <Image
        alt="Camper van on scenic road"
        className={css({
          inlineSize: "full",
          viewTransitionName: "home-image",
        })}
        decoding="sync"
        fetchPriority="high"
        height={900}
        loading="eager"
        pictureClassName={css({
          blockSize: "full",
          inlineSize: "full",
          inset: 0,
          position: "absolute",
        })}
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
    <div
      className={cx(
        grid({
          alignContent: "center",
          gap: "6",
          justifyContent: { md: "center" },
        }),
        css({
          paddingInline: { base: "padding-inline", md: "0" },
          zIndex: 20,
        })
      )}
    >
      <h2
        className={css({
          backdropBlur: "sm",
          backdropFilter: "auto",
          color: "{colors.on-image}",
          fontSize: { base: "2xl", md: "4xl", sm: "3xl" },
          fontWeight: "extrabold",
          lineHeight: { base: "8", md: "10", sm: "9" },
          maxInlineSize: "20ch",
          padding: 1,
          textShadow: "lg",
          textShadowColor: "black",
        })}
      >
        You got the travel plans, we got the travel vans.
      </h2>

      <p
        className={css({
          backdropBlur: "xs",
          backdropFilter: "auto",
          color: "{colors.on-image}",
          maxInlineSize: { base: "34ch", sm: "42.5ch" },
          padding: 1,
          textShadow: "sm",
          textShadowColor: "black",
        })}
      >
        Add adventure to your life by joining the #vanlife movement. Rent the
        perfect van to make your perfect road trip.
      </p>
      <CustomLink
        className={cx(
          buttonVariants({ size: "lg", variant: "default" }),
          css({ maxInlineSize: "42.5ch" })
        )}
        to={href("/vans")}
      >
        Find your van
      </CustomLink>
    </div>
  </PendingUI>
);
export default Home;
