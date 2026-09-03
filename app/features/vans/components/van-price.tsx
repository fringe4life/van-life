import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { displayPrice } from "~/features/vans/utils/display-price";
import { getDiscountedPrice } from "~/utils/pricing";
import type { VanProps } from "../types";

interface VanPriceProps extends VanProps {}

const VanPrice = ({ van: { price, discount } }: VanPriceProps) => {
  const discountedPrice = getDiscountedPrice(price, discount);
  const hasDiscount = discountedPrice < price;
  const priceToDisplay = displayPrice(price);

  if (hasDiscount) {
    return (
      <div className={flex({ alignItems: "baseline", gap: "2" })}>
        <span
          className={css({
            color: "muted.foreground",
            textDecoration: "line-through",
          })}
        >
          {priceToDisplay}
        </span>

        <span className={css({ fontSize: "xl", fontWeight: "bold" })}>
          {displayPrice(discountedPrice)}
        </span>
        <span>/day</span>
      </div>
    );
  }

  return (
    <span className={css({ "@card-full/xl": { fontSize: "xl" } })}>
      {priceToDisplay} <span>/day</span>
    </span>
  );
};

export { VanPrice };
