import { css, cx } from "styled-system/css";
import { cq, grid, wrap } from "styled-system/patterns";
import { Card, CardContent } from "~/components/ui/card";
import { bgSkeleton } from "~/styles";
import { transactionCard } from "./transaction-recipe";

const TransactionSkeleton = () => (
  <div
    className={cx(
      cq({ name: "transaction" }),
      css({ alignSelf: "start", minInlineSize: "0" })
    )}
  >
    <Card aria-hidden="true" className={transactionCard()}>
      <CardContent className={css({ display: "contents" })}>
        <div className={css({ gridArea: "details", minInlineSize: "0" })}>
          <div
            className={cx(
              wrap({ alignItems: "center", gap: "2" }),
              css({
                borderBottomWidth: "thin",
                borderColor: "border.subtle",
                minInlineSize: "0",
                paddingBlockEnd: "4",
              })
            )}
          >
            <div
              className={cx(
                css({
                  blockSize: "5",
                  borderRadius: "full",
                  inlineSize: "28",
                }),
                bgSkeleton
              )}
            />

            <div
              className={cx(
                css({
                  blockSize: "7",
                  borderRadius: "sm",
                  inlineSize: "36",
                }),
                bgSkeleton
              )}
            />
          </div>

          <div
            className={cx(
              css({
                blockSize: "4",
                borderRadius: "sm",
                inlineSize: "3/4",
                marginBlockStart: "3",
              }),
              bgSkeleton
            )}
          />
        </div>

        <div
          className={cx(
            grid({
              "@transaction/sm": {
                justifyItems: "end",
              },
              alignItems: "baseline",
              columnGap: { "@transaction/sm": "1", base: "4" },
              columns: { "@transaction/sm": 1, base: 2 },
              gridArea: "amount",
              rowGap: "2",
            }),
            css({ minInlineSize: "0" })
          )}
        >
          <div
            className={cx(
              css({
                blockSize: "8",
                borderRadius: "sm",
                inlineSize: "32",
              }),
              bgSkeleton
            )}
          />

          <div
            className={cx(
              css({
                blockSize: "4",
                borderRadius: "sm",
                inlineSize: "28",
                justifySelf: "end",
              }),
              bgSkeleton
            )}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

export { TransactionSkeleton };
