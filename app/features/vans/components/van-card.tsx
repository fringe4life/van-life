import { ViewTransition } from "react";
import { css, cx, viewTransition } from "styled-system/css";
import { cq, grid } from "styled-system/patterns";
import { createWebPSrcSet } from "~/components/image/create-optimized-src-set";
import { listImagePriorityProps } from "~/components/image/list-image-priority-props";
import { ProgressiveImage } from "~/components/image/progressive-image";
import { CustomLink } from "~/components/links/custom-link";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { viewTransitionShare } from "~/components/view-transition-share";
import type { VanCardProps } from "~/features/vans/types";
import { usePaginationSliceLock } from "~/pagination/components/pagination-page-epoch";
import { VanBadge } from "./van-badge";
import { vanCard } from "./van-card-recipe";
import { vanViewTransitionName } from "./van-view-transitions";

const VAN_CARD_IMG_SIZES = [200, 250, 300, 350] as const;

const enter = viewTransition({
  new: {
    "--slide-distance-y": "4rem",
    animationName: "fade-in, slide-in-y",
  },
});

const exit = viewTransition({
  old: {
    "--slide-distance-y": "4rem",
    animationName: "fade-out, slide-out-y",
  },
});

const VanCard = ({
  van,
  link,
  action,
  imageIndex = 0,
  linkCoversCard = true,
  priceTransitionName,
}: VanCardProps) => {
  const { type, name, imageUrl } = van;
  const mutePagerEnterExit = usePaginationSliceLock();

  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    sizes: VAN_CARD_IMG_SIZES,
  });

  return (
    <ViewTransition
      {...viewTransitionShare}
      enter={{
        backward: "none",
        default: mutePagerEnterExit ? "none" : enter,
        forward: "none",
      }}
      exit={{
        backward: "none",
        default: mutePagerEnterExit ? "none" : exit,
        forward: "none",
      }}
      name={`card-${van.id}`}
    >
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
              state: van.listingChrome,
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
        >
          <CardHeader
            className={css({
              gridArea: "image",
              position: "relative",
            })}
          >
            <VanBadge van={van} />
            <ViewTransition
              {...viewTransitionShare}
              name={vanViewTransitionName.image(van.id)}
            >
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
            </ViewTransition>
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
                <ViewTransition
                  {...viewTransitionShare}
                  name={vanViewTransitionName.title(van.id)}
                >
                  <span>{name}</span>
                </ViewTransition>

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
              {priceTransitionName ? (
                <ViewTransition
                  {...viewTransitionShare}
                  name={priceTransitionName}
                >
                  {action}
                </ViewTransition>
              ) : (
                action
              )}
            </div>
            <ViewTransition
              {...viewTransitionShare}
              name={vanViewTransitionName.type(van.id)}
            >
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
            </ViewTransition>
          </CardContent>
        </Card>
      </div>
    </ViewTransition>
  );
};

export { VanCard };
