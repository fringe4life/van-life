import { css, cx } from "styled-system/css";
import { cq, flex, grid, visuallyHidden } from "styled-system/patterns";
import { scrollReveal } from "~/components/scroll-reveal-recipe";
import { Card, CardContent } from "~/components/ui/card";
import { money, tabularNums } from "~/components/ui/figures";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Children, Prettify } from "~/types";
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

/**
 * The details column carries the shared size for the header, because the title
 * is a child of the row that queries its own width (#481). Sizes step with the
 * card, not the viewport: the column is 149px at the two-column step and 198px
 * on the desktop grid, and the title has to stay on one line under the badge at
 * both. The clamp is a literal so Panda can extract it.
 */
const detailsColumn = css({
  fontSize: "clamp(0.9375rem, 0.75rem + 1.04cqi, 1.1875rem)",
  gridArea: "details",
  minInlineSize: "0",
});

const headerRow = css({
  borderBottomWidth: "thin",
  borderColor: "border.subtle",
  paddingBlockEnd: "4",
});

const titleText = css({
  fontSize: "inherit",
  fontWeight: "bold",
  letterSpacing: "tight",
  lineHeight: "1.25",
  minInlineSize: "0",
  wordBreak: "break-word",
});

const amountText = css({
  color: "foreground",
  fontSize: "clamp(1.125rem, 1rem + 1.04cqi, 1.5rem)",
  fontWeight: "bold",
  letterSpacing: "tighter",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
});

const dateText = css({
  color: "muted.foreground",
  fontSize: "clamp(0.75rem, 0.7rem + 0.13cqi, 0.875rem)",
  textAlign: "right",
  whiteSpace: "nowrap",
});

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
        scrollReveal({ variant: "sweep" }),
        css({ alignSelf: "start", minInlineSize: "0" })
      )}
    >
      <Card
        aria-labelledby={headingId}
        className={transactionCard({ type })}
        role="article"
      >
        <CardContent className={css({ display: "contents" })}>
          <div className={detailsColumn}>
            <div
              className={cx(
                cq({ name: "transaction-head" }),
                flex({
                  alignItems: "center",
                  gap: "1.5",
                  minInlineSize: "0",
                  wrap: "nowrap",
                }),
                headerRow
              )}
            >
              <TransactionBadge type={type} />
              <h3 className={titleText} id={headingId}>
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
            <p className={amountText}>
              <span className={visuallyHidden()}>Transaction amount: </span>
              <span className={money}>{displayPrice(amount)}</span>
            </p>
            <time
              className={cx(tabularNums, dateText)}
              dateTime={createdAt.toISOString()}
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
