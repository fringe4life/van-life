import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { bgSkeleton } from "~/styles";
import { css, cx } from "../../../../styled-system/css";
import { cq, grid } from "../../../../styled-system/patterns";

const VanCardSkeleton = () => (
  <div
    className={cx(
      cq({ name: "card" }),
      css({
        contain: "content",
        // biome-ignore assist/source/noDuplicateClasses: css styles
        containIntrinsicSize: "auto 300px auto 200px",
        contentVisibility: "auto",
      }),
      "scroll-md"
    )}
  >
    <Card
      className={cx(
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
        {/* Van Badge Skeleton */}
        <div
          className={cx(
            css({
              blockSize: "6",
              borderRadius: "full",
              inlineSize: "16",
              insetBlockStart: "2",
              insetInlineEnd: "2",
              position: "absolute",
              zIndex: "10",
            }),
            bgSkeleton
          )}
        />

        {/* Image Skeleton */}
        <div
          className={cx(
            css({
              aspectRatio: "square",
              borderRadius: "md",
              inlineSize: "full",
            }),
            bgSkeleton
          )}
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
        {/* Title Skeleton */}
        <div
          className={css({
            gridArea: "title",
          })}
        >
          <div
            className={cx(
              css({
                blockSize: "8",
                borderRadius: "sm",
                inlineSize: "3/4",
              }),
              bgSkeleton
            )}
          />
        </div>

        {/* Action Skeleton */}
        <div
          className={cx(
            css({
              blockSize: "8",
              borderRadius: "sm",
              gridArea: "action",
              inlineSize: "16",
              justifySelf: "end",
            }),
            bgSkeleton
          )}
        />

        {/* Badge Skeleton */}
        <div
          className={cx(
            css({
              blockSize: "6",
              borderRadius: "full",
              gridArea: "type",
              inlineSize: "20",
            }),
            bgSkeleton
          )}
        />
      </CardContent>
    </Card>
  </div>
);

export { VanCardSkeleton };
