import { css } from "styled-system/css";
import { Image } from "~/components/image/image";
import type { VanProps } from "~/features/vans/types";

function Photos({ van }: VanProps) {
  return (
    <Image
      alt={van.name}
      className={css({
        aspectRatio: "square",
        borderRadius: "md",
      })}
      height="100"
      src={van.imageUrl}
      srcSet=""
      width="100"
    />
  );
}

export { Photos };
