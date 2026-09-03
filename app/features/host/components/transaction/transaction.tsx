import { Card, CardContent } from "~/components/ui/card";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Children, Prettify } from "~/types";
import { css, cx } from "../../../../../styled-system/css";
import {
  cq,
  grid,
  visuallyHidden,
  wrap,
} from "../../../../../styled-system/patterns";
import { TransactionBadge } from "./transaction-badge";
import { transactionCard, transactionMeta } from "./transaction-recipe";
import type { TransactionProps } from "./transaction-types";

const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  weekday: "short",
  year: "numeric",
});

type TransactionShellProps = Prettify<Children & TransactionProps>;

const Transaction = ({
  amount,
  children,
  createdAt,
  id,
  type,
}: TransactionShellProps) => {
  const { title } = transactionMeta[type];
  const headingId = `transaction-${id}-title`;

  return (
    <div
      className={cx(
        cq({ name: "transaction" }),
        css({ alignSelf: "start", minInlineSize: "0" })
      )}
    >
      <Card
        aria-labelledby={headingId}
        className={transactionCard({ type })}
        role="article"
      >
        <CardContent className={css({ display: "contents" })}>
          <div className={css({ gridArea: "details", minInlineSize: "0" })}>
            <div
              className={cx(
                wrap({ alignItems: "center", gap: "2" }),
                css({
                  borderBottomWidth: "thin",
                  borderColor: "border.subtle",
                  paddingBlockEnd: "4",
                })
              )}
            >
              <TransactionBadge type={type} />
              <h3
                className={css({
                  fontSize: "lg",
                  fontWeight: "bold",
                  letterSpacing: "tight",
                  minInlineSize: "0",
                  wordBreak: "break-word",
                })}
                id={headingId}
              >
                {title}
              </h3>
            </div>

            <div className={css({ marginBlockStart: "3", minInlineSize: "0" })}>
              {children}
            </div>
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
              })
            )}
          >
            <p
              className={cx(
                css({
                  color: "foreground",
                  fontSize: "2xl",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: "extrabold",
                  letterSpacing: "tighter",
                  textTransform: "uppercase",
                })
              )}
            >
              <span className={visuallyHidden()}>Transaction amount: </span>
              {displayPrice(amount)}
            </p>
            <time
              className={css({
                color: "muted.foreground",
                fontSize: "sm",
                textAlign: "right",
                whiteSpace: "nowrap",
              })}
              dateTime={createdAt.toISOString()}
              suppressHydrationWarning
            >
              {transactionDateFormatter.format(createdAt)}
            </time>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Transaction };
