import { css, cx } from "styled-system/css";
import { cq, grid } from "styled-system/patterns";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { listImagePriorityProps } from "~/components/image/list-image-priority-props";
import { ProgressiveImage } from "~/components/image/progressive-image";
import { CustomLink } from "~/components/links/custom-link";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { VanCardProps } from "~/features/vans/types";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import { VanBadge } from "./van-badge";
import { vanCard } from "./van-card-recipe";

const VAN_CARD_IMG_SIZES = [200, 250, 300, 350] as const;

const VanCard = ({
  van,
  link,
  action,
  imageIndex = 0,
  linkCoversCard = true,
}: VanCardProps) => {
  const { type, name, imageUrl } = van;

  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    sizes: VAN_CARD_IMG_SIZES,
  });

  return (
    <div
      className={cx(
        cq({ name: "card" }),
        css({
          contain: "content",
          // biome-ignore assist/source/noDuplicateClasses: css
          containIntrinsicSize: "auto 300px auto 200px",
          contentVisibility: "auto",
        })
      )}
    >
      <Card
        className={cx(
          vanCard({
            state: lowercaseVanState(van),
          }),
          css({
            position: "relative",
          }),
          grid({
            "@card/md": { gap: "4" },
            gap: "0",
            gridTemplateAreas: {
              "@card/md": '"image details"',
              base: '"image" "details"',
            },
            gridTemplateColumns: {
              "@card/md": "200px minmax(0, 1fr)",
            },
          })
        )}
        style={{ viewTransitionName: `card-${van.id}` }}
      >
        <CardHeader
          className={css({
            gridArea: "image",
            position: "relative",
          })}
        >
          <VanBadge van={van} />
          <ProgressiveImage
            alt={name}
            className={css({
              aspectRatio: "square",
              borderRadius: "md",
              inlineSize: "full",
            })}
            height="200"
            key={imageUrl} // remount ProgressiveImage when src changes
            sizes="(max-width: 300px) 250px, (max-width: 400px) 300px, 350px"
            src={imageUrl}
            srcSet={srcSet}
            width="200"
            {...listImagePriorityProps(imageIndex)}
          />
        </CardHeader>

        <CardContent
          className={grid({
            alignContent: "center",
            gap: "0",
            gridArea: "details",
            gridTemplateAreas: '"title" "action" "type"',
            minInlineSize: "0",
          })}
        >
          <CardTitle
            className={css({
              fontSize: "2xl",
              gridArea: "title",
            })}
          >
            <CustomLink title={name} to={link}>
              {name}

              <span
                className={
                  linkCoversCard
                    ? css({
                        blockSize: "full",
                        inlineSize: "full",
                        inset: 0,
                        overflow: "hidden",
                        position: "absolute",
                      })
                    : undefined
                }
              />
            </CustomLink>
          </CardTitle>
          <div
            className={css({
              gridArea: "action",
              justifySelf: "end",
              maxInlineSize: "full",
              minInlineSize: "0",
              position: "relative",
              textAlign: "end",
              zIndex: "1",
            })}
          >
            {action}
          </div>
          <Badge
            className={css({
              gridArea: "type",
              justifySelf: "start",
              textTransform: "lowercase",
            })}
            variant={type}
          >
            {type}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export { VanCard };
