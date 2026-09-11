import { css } from "styled-system/css";
import type { VanProps } from "~/features/vans/types";
import { VanPrice } from "../van-price";

function Pricing({ van }: VanProps) {
  return (
    <div className={css({ marginBlock: { base: "4", sm: "6" } })}>
      <VanPrice van={van} />
    </div>
  );
}

export { Pricing };
