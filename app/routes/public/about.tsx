import { ViewTransition } from "react";
import { data, href } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, flex, grid } from "styled-system/patterns";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { Image } from "~/components/image/image";
import { HIGH_QUALITY_IMAGE_QUALITY } from "~/components/image/img-constants";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import { buttonVariants } from "~/components/ui/button-variants";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionHero } from "~/components/view-transition-share";
import {
  forwardDataHeaders,
  PUBLIC_SHORT_CACHE_HEADERS,
} from "~/constants/cache-headers";
import { buildAboutPageSeo } from "~/seo/build-page-seo.server";
import { SeoHead } from "~/seo/seo-head";
import { fullBleed } from "~/styles";

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

const aboutColumnClassName = css({
  inlineSize: "full",
  marginInline: "auto",
  maxInlineSize: "content",
});

const About = ({ loaderData }: Route.ComponentProps) => (
  <>
    <ViewTransition
      {...viewTransitionHero}
      name={chromeViewTransitionName.aboutImage}
    >
      <div
        className={cx(
          aboutColumnClassName,
          css({
            marginBlockEnd: { base: "4", md: "10", sm: "6" },
            overflow: "visible",
          })
        )}
      >
        <Image
          alt="a couple enjoying their adventure"
          className={css({
            aspectRatio: "video",
            maskImage: { xs: "url(/cloud-5.svg)" },
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "cover",
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
      </div>
    </ViewTransition>
    <PendingUI
      as="section"
      className={cx(
        grid({
          gap: { base: "4", md: "10", sm: "6" },
        }),
        aboutColumnClassName
      )}
    >
      <SeoHead {...loaderData.seo} />

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
          rental. Our vans are recertified before each trip to ensure your
          travel plans can go off without a hitch. (Hitch costs extra 😉)
        </p>

        <p
          className={css({
            flexBasis: "1/2",
            flexGrow: 1,
            fontSize: { sm: "xl" },
            marginInline: { base: "2", sm: "4" },
          })}
        >
          Our team is full of vanlife enthusiasts who know firsthand the magic
          of touring the world on 4 wheels. So dive into our vast catalog today
          and make your own magic in the great outdoors 🌳!
        </p>
      </div>

      <article
        className={cx(
          cq({ name: "card" }),
          css({
            backgroundColor: "surface.accent",
            borderColor: "border.accent",
            borderRadius: "xl",
            borderStyle: "solid",
            borderWidth: "1",
            inlineSize: "full",
            marginInline: "auto",
            maxInlineSize: "content",
            paddingBlock: { base: "5", md: "10", sm: "8" },
            paddingInline: { base: "5", lg: "12", md: "10", sm: "8" },
          })
        )}
      >
        <div
          className={grid({
            alignItems: { "@card/2xl": "center" },
            columnGap: { "@card/2xl": "12", base: "5" },
            gap: { "@card/2xl": "0", base: "5" },
            gridTemplateAreas: {
              "@card/2xl": '"statement action"',
              base: '"statement" "action"',
            },
            gridTemplateColumns: {
              "@card/2xl": "minmax(0, 1fr) minmax(16rem, 18rem)",
              base: "minmax(0, 1fr)",
            },
          })}
        >
          <div className={css({ gridArea: "statement", minInlineSize: "0" })}>
            <p
              className={css({
                color: "muted.foreground",
                fontSize: "xs",
                fontWeight: "bold",
                letterSpacing: "widest",
                marginBlockEnd: "3",
                textTransform: "uppercase",
              })}
            >
              Plan the getaway
            </p>
            <h3
              className={css({
                fontSize: { "@card/xl": "3xl", base: "xl", sm: "2xl" },
                fontWeight: "extrabold",
                lineHeight: "tight",
                maxInlineSize: "620px",
              })}
            >
              <span
                className={css({
                  display: "block",
                  whiteSpace: { "@card/xl": "nowrap" },
                })}
              >
                Your van is ready.
              </span>
              <span
                className={css({
                  display: "block",
                  whiteSpace: { "@card/xl": "nowrap" },
                })}
              >
                Your destination is waiting.
              </span>
            </h3>
            <p
              className={css({
                color: "muted.foreground",
                fontSize: { base: "base", sm: "lg" },
                lineHeight: "6",
                marginBlockStart: "4",
                maxInlineSize: "560px",
              })}
            >
              Explore the catalog, then choose the van that fits your trip.
            </p>
          </div>
          <div
            className={css({
              alignItems: { "@card/2xl": "end", base: "stretch" },
              display: "flex",
              flexDirection: "column",
              gap: "3",
              gridArea: "action",
              minInlineSize: "0",
            })}
          >
            <CustomLink
              className={cx(
                buttonVariants({ variant: "secondary" }),
                css({
                  inlineSize: { "@card/2xl": "auto", base: "full" },
                  minInlineSize: { "@card/2xl": "16.25rem" },
                })
              )}
              to={href("/vans")}
            >
              Explore our vans
            </CustomLink>
            <p
              className={css({
                color: "muted.foreground",
                fontSize: "sm",
                fontWeight: "medium",
                textAlign: { "@card/2xl": "end", base: "center" },
              })}
            >
              Start with the right fit.
            </p>
          </div>
        </div>
      </article>
    </PendingUI>
  </>
);
export default About;
