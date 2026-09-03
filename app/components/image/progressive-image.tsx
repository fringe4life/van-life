import { useState } from "react";
import { Image, type ImgProps } from "~/components/image/image";
import { css, cx } from "../../../styled-system/css";

/**
 * Blur/pulse placeholder until `onLoad`. `loaded` is instance state, seeded
 * from `loading === "eager"` — it does **not** reset when `src` changes.
 *
 * **Contract:** remount when `src` can change. Pass `key={src}` (or
 * `key={imageUrl}`) at the call site so a new URL gets a fresh `loaded` flag
 * and the placeholder runs again. `VanCard` does this.
 */
const ProgressiveImage = ({
  className,
  loading,
  onLoad,
  src,
  ...rest
}: ImgProps) => {
  // Initialize loaded state based on loading prop
  // for high priority images, we can set the loaded state to true immediately
  const [loaded, setLoaded] = useState(() => loading === "eager");

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  };

  return (
    <Image
      {...rest}
      className={cx(
        !loaded && css({ animation: "pulse", blur: "sm" }),
        className
      )}
      loading={loading}
      onLoad={handleLoad}
      src={src}
    />
  );
};

export { ProgressiveImage };
