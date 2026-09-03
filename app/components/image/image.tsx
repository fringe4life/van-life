import { css, cx } from "../../../styled-system/css";

type Size = string | number;

interface ImageSource {
  media: string;
  sizes?: string;
  srcSet: string;
  type?: string;
}

interface ImgProps extends React.ComponentProps<"img"> {
  height: Size;
  pictureClassName?: string;
  sources?: readonly ImageSource[];
  src: string;
  srcSet?: string;
  width: Size;
}

const Image = ({
  src,
  alt,
  className,
  pictureClassName = "",
  sources,
  decoding = "async",
  loading = "lazy",
  ...rest
}: ImgProps) => (
  <picture className={cx(css({ display: "block" }), pictureClassName)}>
    {sources?.map(({ media, sizes: sourceSizes, srcSet: sourceSet, type }) => (
      <source
        key={`${media}-${sourceSet}`}
        media={media}
        sizes={sourceSizes}
        srcSet={sourceSet}
        type={type}
      />
    ))}
    {/** biome-ignore lint/correctness/useImageSize: passed in as {...rest} */}
    <img
      className={cx(
        css({
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          blockSize: "full",
          lineHeight: 0,
          maxInlineSize: "full",
          objectFit: "cover",
          objectPosition: "center",
          textAlign: "middle",
          textDecoration: "none",
          textStyle: "italic",
          transitionDuration: "200ms",
          transitionProperty: "opacity",
          transitionTimingFunction: "ease-in-out",
        }),
        className
      )}
      decoding={decoding}
      loading={loading}
      {...rest}
      alt={alt}
      src={src}
    />
  </picture>
);

export type { ImgProps };
export { Image };
