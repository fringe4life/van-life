import type { ComponentPropsWithoutRef } from "react";
import { href } from "react-router";
import { GenericComponent } from "~/components/generic-component";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { Image } from "~/components/image/image";
import { HIGH_QUALITY_IMAGE_QUALITY } from "~/components/image/img-constants";
import { CustomNavLink } from "~/components/links/custom-nav-link";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { NavLinkClassNameProps } from "~/features/navigation/types";
import type { VanProps } from "~/features/vans/types";
import { toLowercaseVanType } from "~/features/vans/utils/validators";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import type { Id } from "~/types";
import { css, cx } from "../../../../../styled-system/css";
import { cq, flex, grid } from "../../../../../styled-system/patterns";
import { VanBadge } from "../van-badge";
import { vanCard } from "../van-card-recipe";
import { VanPrice } from "../van-price";
import { VanDetailCardContext } from "./context";
import { Details } from "./details";
import { Photos } from "./photos";
import { Pricing } from "./pricing";

const HOST_VAN_DETAIL_IMG_SIZES = [200, 250, 300, 400] as const;

type VanDetailCardProps = VanProps & ComponentPropsWithoutRef<"div">;

const hostVanDetailNavClassName = ({
  isActive,
  isPending,
}: NavLinkClassNameProps) => {
  if (isPending) {
    return css({ color: "success" });
  }
  if (isActive) {
    return css({ textDecoration: "underline" });
  }
  return "";
};

const renderHostVanDetailNavProps = <T extends Id>(item: T) => ({
  className: hostVanDetailNavClassName,
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
        <Card
          className={vanCard({ state: lowercaseVanState(van) })}
          style={{ viewTransitionName: `card-${van.id}` }}
        >
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
            </div>

            <div
              className={css({
                alignContent: "center",
                gridArea: "content",
                minInlineSize: "0",
              })}
            >
              <Badge
                className={css({ "@detail/md": { marginBlockStart: "4" } })}
                variant={toLowercaseVanType(type)}
              >
                {type}
              </Badge>

              <CardTitle
                className={css({
                  fontSize: "2xl",
                  fontWeight: "bold",
                  my: "6",
                  textAlign: "balance",
                })}
              >
                {name}
              </CardTitle>
              <VanPrice van={van} />
            </div>
          </CardHeader>
          <CardContent>
            <GenericComponent
              Component={CustomNavLink}
              className={flex({ gap: "6", marginBlock: "6" })}
              emptyState={null}
              errorState={{ title: "Something went wrong" }}
              items={navLinks}
              noMatchState={null}
              renderProps={renderHostVanDetailNavProps}
            />
          </CardContent>

          <CardFooter>{children}</CardFooter>
        </Card>
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
