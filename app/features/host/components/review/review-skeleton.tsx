import { Card, CardContent } from "~/components/ui/card";
import { bgSkeleton } from "~/styles";
import { css, cx } from "../../../../../styled-system/css";
import { cq, flex, grid, wrap } from "../../../../../styled-system/patterns";

const ReviewSkeleton = () => (
  <div
    className={cx(
      cq({ name: "review" }),
      css({ alignSelf: "start", minInlineSize: "0" })
    )}
  >
    <Card
      aria-hidden="true"
      className={cx(
        grid({
          "@review/lg": {
            alignItems: "center",
            columnGap: "8",
            gridTemplateAreas: '"content metadata"',
            gridTemplateColumns: "minmax(0,1fr) minmax(12rem,auto)",
            rowGap: "0",
          },
          alignItems: "start",
          columns: 1,
          gridTemplateAreas: '"content" "metadata"',
          rowGap: "4",
        }),
        css({
          backgroundColor: "card",
          borderColor: "border.subtle",
          minInlineSize: "0",
          overflow: "hidden",
          padding: "6",
          paddingInlineStart: { "@review/lg": "10", base: "8" },
          position: "relative",
          shadow: "none",
        })
      )}
    >
      <span
        className={cx(
          css({
            backgroundColor: "surface.muted",
            borderLeftRadius: "xl",
            inlineSize: "1.5",
            insetBlock: "0",
            insetInlineStart: "0",
            pointerEvents: "none",
            position: "absolute",
          })
        )}
      />

      <CardContent className={css({ display: "contents" })}>
        <div className={css({ gridArea: "content", minInlineSize: "0" })}>
          <div
            className={wrap({
              alignItems: "center",
              gap: "3",
              marginBlockEnd: "4",
              minInlineSize: "0",
            })}
          >
            <div
              className={cx(
                css({
                  blockSize: "3",
                  borderRadius: "sm",
                  inlineSize: "24",
                }),
                bgSkeleton
              )}
            />

            <div
              className={cx(
                css({
                  blockSize: "5",
                  borderRadius: "full",
                  inlineSize: "20",
                }),
                bgSkeleton
              )}
            />
          </div>

          <div
            className={cx(
              css({
                blockSize: "7",
                borderRadius: "sm",
                inlineSize: "3/4",
              }),
              bgSkeleton
            )}
          />

          <div
            className={cx(
              css({
                blockSize: "7",
                borderRadius: "sm",
                inlineSize: "1/2",
                marginBlockStart: "2",
              }),
              bgSkeleton
            )}
          />

          <div
            className={cx(
              css({
                blockSize: "var(--star-size)",
                borderRadius: "sm",
                inlineSize: "var(--rating-stars-width)",
                marginBlockStart: "5",
              }),
              bgSkeleton
            )}
          />
        </div>

        <div
          className={cx(
            flex({
              alignItems: { "@review/lg": "start", base: "center" },
              flexDirection: { "@review/lg": "column", base: "row" },
              flexWrap: "wrap",
              gap: { "@review/lg": "3", base: "4" },
            }),
            css({
              "@review/lg": {
                alignSelf: "center",
                borderLeftWidth: "thin",
                borderTopWidth: "0",
                gridArea: "metadata",
                justifySelf: "end",
                paddingBlockStart: "0",
                paddingInlineStart: "8",
              },
              borderColor: "border.subtle",
              borderTopWidth: "thin",
              gridArea: "metadata",
              minInlineSize: "0",
              paddingBlockStart: "4",
            })
          )}
        >
          <div
            className={cx(
              css({
                blockSize: "3",
                borderRadius: "sm",
                inlineSize: "16",
              }),
              bgSkeleton
            )}
          />

          <div
            className={cx(
              css({
                blockSize: "4",
                borderRadius: "sm",
                inlineSize: "24",
              }),
              bgSkeleton
            )}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

export { ReviewSkeleton };
