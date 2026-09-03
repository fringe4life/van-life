import { href } from "react-router";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { Image } from "~/components/image/image";
import { HIGH_QUALITY_IMAGE_QUALITY } from "~/components/image/img-constants";
import { CustomLink } from "~/components/links/custom-link";
import { Badge } from "~/components/ui/badge";
import { badgeVariants } from "~/components/ui/badge-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { VanModel } from "~/db/client.server";
import {
  toLowercaseVanType,
  validateLowercaseVanType,
} from "~/features/vans/utils/validators";
import { isVanAvailable } from "~/features/vans/utils/van-state-helpers";
import { css, cx } from "../../../../styled-system/css";
import { cq, grid, hstack } from "../../../../styled-system/patterns";
import { VanPrice } from "./van-price";

const VAN_DETAIL_IMG_SIZES = [300, 450, 600, 750, 1000] as const;

interface VanDetailProps {
  van: VanModel;
}

export default function VanDetail({
  van: { imageUrl, description, type, name, slug: vanSlug },
  van,
}: VanDetailProps) {
  const vanIsAvailable = isVanAvailable(van);
  const rentLabel = vanIsAvailable ? "Rent this van" : "Van not available";
  const rentTo = vanIsAvailable
    ? href("/host/rentals/rent/:vanSlug", { vanSlug })
    : href("/vans/:vanSlug", { vanSlug });
  const rentVariant = vanIsAvailable ? toLowercaseVanType(type) : "unavailable";
  const rentClassName = badgeVariants({ variant: rentVariant });
  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
    sizes: VAN_DETAIL_IMG_SIZES,
  });

  return (
    <div className={cx(cq({ name: "card-full" }), css({ contain: "content" }))}>
      <Card
        className={cx(
          grid({
            columnGap: "4",
            gridTemplateAreas: {
              "@card-full/xl":
                // biome-ignore assist/source/noDuplicateClasses: repeated areas intentionally span detail tracks
                '"media content" "media content" "media content"',
              base: '"media" "content" "footer"',
            },
            gridTemplateColumns: {
              "@card-full/xl": "repeat(2, minmax(0, 1fr))",
            },
            // biome-ignore assist/source/noDuplicateClasses: repeated auto rows intentionally define detail tracks
            gridTemplateRows: { "@card-full/xl": "auto auto 1fr" },
            rowGap: "2",
          })
        )}
        style={{ viewTransitionName: `card-${van.id}` }}
      >
        <CardHeader
          className={css({
            gridArea: "media",
            position: "relative",
          })}
        >
          <Image
            alt={name}
            className={css({ aspectRatio: "square", borderRadius: "md" })}
            decoding="sync"
            fetchPriority="high"
            height="600"
            loading="eager"
            sizes="(min-width: 1024px) 500px, (min-width: 768px) 400px, 300px"
            src={imageUrl}
            srcSet={srcSet}
            width="600"
          />
        </CardHeader>

        <CardContent
          className={cx(
            grid({
              alignItems: "stretch",
              columnGap: "4",
              gridArea: "content",
              gridTemplateAreas: '"heading" "metadata" "description"',
              // biome-ignore assist/source/noDuplicateClasses: repeated auto rows intentionally define detail tracks
              gridTemplateRows: { "@card-full/xl": "auto auto 1fr" },
              rowGap: "2",
            }),
            css({
              alignSelf: { "@card-full/xl": "center" },
              minInlineSize: "0",
            })
          )}
        >
          {/* First row: Name and Rent button */}
          <div
            className={css({
              alignItems: { "@card-full/xl": "center" },
              display: { "@card-full/xl": "flex" },
              gridArea: "heading",
              justifyContent: { "@card-full/xl": "space-between" },
            })}
          >
            <CardTitle
              className={css({
                "@card-full/xl": {
                  fontSize: "xl",
                  margin: "0",
                },
              })}
            >
              {name}
            </CardTitle>
            <CustomLink
              className={cx(
                rentClassName,
                css({
                  "@card-full/xl": { flexShrink: 0 },
                  "@card-full/xlDown": { display: "none" },
                })
              )}
              to={rentTo}
            >
              {rentLabel}
            </CustomLink>
          </div>

          {/* Second row: Badge and Price */}
          <div
            className={cx(
              css({ gridArea: "metadata" }),
              hstack({ gap: "4", justifyContent: "space-between" })
            )}
          >
            <Badge
              className={css({ "@card-full/xl": { margin: "0" } })}
              size="small"
              variant={validateLowercaseVanType(type.toLowerCase())}
            >
              {type}
            </Badge>

            <div
              className={css({
                "@card-full/xl": { fontSize: "xl", margin: "0" },
              })}
            >
              <VanPrice van={van} />
            </div>
          </div>

          {/* Third row: Description */}
          <CardDescription
            className={css({
              "@card-full/xl": {
                fontSize: "unset",
                margin: "0",
              },
              gridArea: "description",
            })}
          >
            {description}
          </CardDescription>
        </CardContent>

        {/* Mobile/Tablet Footer - hidden on desktop */}
        <CardFooter
          className={css({
            "@card-full/xl": {
              display: "none",
            },
            gridArea: "footer",
          })}
        >
          <CustomLink
            className={cx(
              rentClassName,
              css({ "@card-full/lg": { inlineSize: "full" } })
            )}
            to={rentTo}
          >
            {rentLabel}
          </CustomLink>
        </CardFooter>
      </Card>
    </div>
  );
}
