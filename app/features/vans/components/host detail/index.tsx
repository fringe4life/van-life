import { type ComponentPropsWithoutRef, ViewTransition } from "react";
import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, flex, grid } from "styled-system/patterns";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { Image } from "~/components/image/image";
import { HIGH_QUALITY_IMAGE_QUALITY } from "~/components/image/img-constants";
import { ItemList } from "~/components/item-list";
import { CustomNavLink } from "~/components/links/custom-nav-link";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { viewTransitionShare } from "~/components/view-transition-share";
import type { VanProps } from "~/features/vans/types";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import { navLinkClassName } from "~/navigation/styles";
import type { Id, Prettify } from "~/types";
import { VanBadge } from "../van-badge";
import { vanCard } from "../van-card-recipe";
import { VanPrice } from "../van-price";
import { vanViewTransitionName } from "../van-view-transitions";
import { VanDetailCardContext } from "./context";
import { Details } from "./details";
import { Photos } from "./photos";
import { Pricing } from "./pricing";

const HOST_VAN_DETAIL_IMG_SIZES = [200, 250, 300, 400] as const;

type VanDetailCardProps = Prettify<VanProps & ComponentPropsWithoutRef<"div">>;

const renderHostVanDetailNavProps = <T extends Id>(item: T) => ({
  className: navLinkClassName,
  ...item,
});

const VanDetailCardRoot = ({
  van,
  children,
  className,
}: VanDetailCardProps) => {
  const { imageUrl, slug: vanSlug, name, type } = van;

  const navLinks = [
    {
      children: "Details",
      end: true,
      id: "details",
      to: href("/host/vans/:vanSlug/:action?", { action: undefined, vanSlug }),
    },
    {
      children: "Pricing",
      id: "pricing",
      to: href("/host/vans/:vanSlug/:action?", { action: "pricing", vanSlug }),
    },
    {
      children: "Photos",
      id: "photos",
      to: href("/host/vans/:vanSlug/:action?", { action: "photos", vanSlug }),
    },
  ];

  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
    sizes: HOST_VAN_DETAIL_IMG_SIZES,
  });
  // Create optimized WebP srcSet with 1:1 aspect ratio for both mobile and desktop

  return (
    <VanDetailCardContext value={van}>
      <div
        className={cx(
          cq({ name: "detail" }),
          css({ contain: "content", inlineSize: "full", maxInlineSize: "xl" }),
          className
        )}
      >
        <ViewTransition {...viewTransitionShare} name={`card-${van.id}`}>
          <Card className={vanCard({ state: lowercaseVanState(van) })}>
            <CardHeader
              className={grid({
                "@detail/md": {
                  columnGap: "4",
                  // biome-ignore assist/source/noDuplicateClasses: repeated areas intentionally span detail tracks
                  gridTemplateAreas: '"media content" "media content"',
                  gridTemplateColumns: "200px 1fr",
                  gridTemplateRows: "200px 1fr",
                },
                "@detail/xl": {
                  // biome-ignore assist/source/noDuplicateClasses: repeated areas intentionally span detail tracks
                  gridTemplateAreas: '"media content" "media content"',
                  gridTemplateColumns: "300px 1fr",
                  gridTemplateRows: "300px 1fr",
                },
                gap: "0",
                gridTemplateAreas: '"media" "content"',
              })}
            >
              <div className={css({ gridArea: "media", position: "relative" })}>
                <VanBadge van={van} />
                <ViewTransition
                  {...viewTransitionShare}
                  name={vanViewTransitionName.image(van.id)}
                >
                  <Image
                    alt={name}
                    className={css({
                      aspectRatio: "square",
                      borderRadius: "sm",
                      inlineSize: { "@detail/md": "auto", base: "full" },
                    })}
                    decoding="sync"
                    fetchPriority="high"
                    height="300"
                    loading="eager"
                    pictureClassName={css({ aspectRatio: "square" })}
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 200px, 400px"
                    src={imageUrl}
                    srcSet={srcSet}
                    width="300"
                  />
                </ViewTransition>
              </div>

              <div
                className={css({
                  alignContent: "center",
                  gridArea: "content",
                  minInlineSize: "0",
                })}
              >
                <ViewTransition
                  {...viewTransitionShare}
                  name={vanViewTransitionName.type(van.id)}
                >
                  <Badge
                    className={css({
                      "@detail/md": { marginBlockStart: "4" },
                      textTransform: "lowercase",
                    })}
                    variant={type}
                  >
                    {type}
                  </Badge>
                </ViewTransition>

                <CardTitle
                  className={css({
                    fontSize: "2xl",
                    fontWeight: "bold",
                    my: "6",
                    textAlign: "balance",
                  })}
                >
                  <ViewTransition
                    {...viewTransitionShare}
                    name={vanViewTransitionName.title(van.id)}
                  >
                    <span>{name}</span>
                  </ViewTransition>
                </CardTitle>
                <ViewTransition
                  {...viewTransitionShare}
                  name={vanViewTransitionName.price(van.id)}
                >
                  <VanPrice van={van} />
                </ViewTransition>
              </div>
            </CardHeader>
            <CardContent>
              <ItemList
                Component={CustomNavLink}
                className={flex({ gap: "6", marginBlock: "6" })}
                items={navLinks}
                renderProps={renderHostVanDetailNavProps}
              />
            </CardContent>

            <CardFooter>{children}</CardFooter>
          </Card>
        </ViewTransition>
      </div>
    </VanDetailCardContext>
  );
};

/**
 * Compound component for host van details with sub-components
 * @example
 * ```tsx
 * <VanDetailCard van={van}>
 *   <VanDetailCard.Details />
 *   <VanDetailCard.Photos />
 *   <VanDetailCard.Pricing />
 * </VanDetailCard>
 * ```
 */
const VanDetailCard = Object.assign(VanDetailCardRoot, {
  Details,
  Photos,
  Pricing,
});

export { VanDetailCard };
