import { type ComponentPropsWithoutRef, ViewTransition } from "react";
import { css, cx, viewTransition } from "styled-system/css";
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
import { navLinkClassName } from "~/navigation/styles";
import type { Prettify } from "~/types";
import { VanBadge } from "../van-badge";
import { vanCard } from "../van-card-recipe";
import { VanPrice } from "../van-price";
import { vanViewTransitionName } from "../van-view-transitions";
import type { HostVanDetailNavItem } from "./get-host-van-detail-nav-items";

const HOST_VAN_DETAIL_IMG_SIZES = [200, 250, 300, 400] as const;
const footerTransition = viewTransition("fadeSlide");

type VanDetailCardProps = Prettify<
  VanProps &
    ComponentPropsWithoutRef<"div"> & {
      navItems: readonly HostVanDetailNavItem[];
    }
>;

const renderHostVanDetailNavProps = (item: HostVanDetailNavItem) => ({
  className: navLinkClassName,
  ...item,
});

const VanDetailCard = ({
  van,
  children,
  className,
  navItems,
}: VanDetailCardProps) => {
  const { imageUrl, name, type } = van;

  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
    sizes: HOST_VAN_DETAIL_IMG_SIZES,
  });

  return (
    <div
      className={cx(
        cq({ name: "detail" }),
        css({ contain: "content", inlineSize: "full", maxInlineSize: "xl" }),
        className
      )}
    >
      <ViewTransition {...viewTransitionShare} name={`card-${van.id}`}>
        <Card className={vanCard({ state: van.listingChrome })}>
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
              as="nav"
              Component={CustomNavLink}
              className={flex({ gap: "6", marginBlock: "6" })}
              items={navItems}
              renderProps={renderHostVanDetailNavProps}
              wrapperProps={{ "aria-label": "Van detail sections" }}
            />
          </CardContent>

          <ViewTransition default="none" update={footerTransition}>
            <CardFooter>{children}</CardFooter>
          </ViewTransition>
        </Card>
      </ViewTransition>
    </div>
  );
};

export { VanDetailCard };
