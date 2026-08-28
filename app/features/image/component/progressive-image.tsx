import { useState } from "react";
import { Image, type ImgProps } from "~/features/image/component/image";
import { cn } from "~/utils/utils";

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
      className={cn(!loaded && "animate-pulse blur-sm", className)}
      loading={loading}
      onLoad={handleLoad}
      src={src}
    />
  );
};

export { ProgressiveImage };
