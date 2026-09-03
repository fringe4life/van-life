import { css } from "styled-system/css";
import { Image } from "~/components/image/image";
import { useVanDetailCard } from "./context";

/**
 * Photos sub-component - displays van image
 */
function Photos() {
  const van = useVanDetailCard();

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
