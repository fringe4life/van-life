import { VanPrice } from "../van-price";
import { useVanDetailCard } from "./context";

/**
 * Pricing sub-component - displays van price with discount
 */
function Pricing() {
  const van = useVanDetailCard();

  return (
    <div className="my-4 sm:my-6">
      <VanPrice van={van} />
    </div>
  );
}

export { Pricing };
