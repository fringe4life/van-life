import { css } from "../../../../../styled-system/css";
import { VanPrice } from "../van-price";
import { useVanDetailCard } from "./context";

/**
 * Pricing sub-component - displays van price with discount
 */
function Pricing() {
  const van = useVanDetailCard();

  return (
    <div className={css({ marginBlock: { base: "4", sm: "6" } })}>
      <VanPrice van={van} />
    </div>
  );
}

export { Pricing };
