import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Maybe } from "~/types";

interface HostIncomeSectionProps {
  elapsedDays: number;
  isBalancePending: boolean;
  name: Maybe<string>;
  optimisticBalance: number;
  sumIncome: number;
}

const HostIncomeSection = ({
  name,
  sumIncome,
  elapsedDays,
  optimisticBalance,
  isBalancePending,
}: HostIncomeSectionProps) => (
  <div
    className={cx(
      grid({
        alignItems: "center",
        columnGap: "2",
        gridTemplateAreas: '"heading ." "metrics details"',
        gridTemplateColumns: "minmax(min-content, 1fr) auto",
        justifyContent: "space-between",
      }),
      css({
        backgroundColor: "surface.muted",
        inlineSize: "full",
        paddingBlock: { base: "6", sm: "9" },
        paddingInline: "padding-inline",
      })
    )}
  >
    <h2
      className={css({
        color: "foreground",
        fontSize: { base: "2xl", md: "4xl", sm: "3xl" },
        fontWeight: "bold",
        gridArea: "heading",
        lineHeight: { base: "8", md: "10", sm: "9" },
        viewTransitionName: "van-header",
      })}
    >
      Welcome, {name ? name : "User"}!
    </h2>

    <dl
      className={cx(
        grid({
          alignItems: "center",
          gap: "4",
          gridArea: "metrics",
          gridTemplateColumns: "1fr min-content",
          gridTemplateRows: "1fr",
          justifyContent: "space-between",
        }),
        css({
          color: "muted.foreground",
          fontSize: { base: "base", sm: "unset" },
          fontWeight: "light",
          margin: "0",
          paddingBlock: "4",
        })
      )}
    >
      <dt
        className={css({
          fontSize: { base: "sm", sm: "unset" },
          fontWeight: { base: "light", sm: "normal" },
        })}
      >
        Rents last{" "}
        <span
          className={css({
            fontWeight: { sm: "medium" },
            textDecoration: "underline",
          })}
        >
          {elapsedDays} days
        </span>
      </dt>

      <dd
        className={css({
          color: "foreground",
          fontSize: { base: "xl", md: "5xl", sm: "4xl", xs: "2xl" },
          fontWeight: { base: "semibold", md: "extrabold", sm: "bold" },
          justifySelf: "end",
          margin: "0",
          viewTransitionName: "income-amount",
        })}
      >
        {displayPrice(sumIncome)}
      </dd>

      <dt
        className={css({
          fontSize: { base: "sm", sm: "unset" },
        })}
      >
        Balance
      </dt>

      <dd
        aria-busy={isBalancePending}
        className={cx(
          css({
            color: "foreground",
            fontSize: { base: "xl", md: "5xl", sm: "4xl", xs: "2xl" },
            fontWeight: { base: "semibold", md: "extrabold", sm: "bold" },
            justifySelf: "end",
            margin: "0",
            viewTransitionName: "balance-amount",
          }),
          isBalancePending && css({ opacity: 0.75 })
        )}
      >
        {displayPrice(optimisticBalance)}
      </dd>
    </dl>
    <CustomLink
      className={css({ gridArea: "details" })}
      to={href("/host/rental-activity")}
    >
      Details
    </CustomLink>
  </div>
);

export { HostIncomeSection };
