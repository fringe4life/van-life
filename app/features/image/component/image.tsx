import { cn } from "~/utils/utils";

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
  <picture className={cn("block", pictureClassName)}>
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
      className={cn(
        "h-full max-w-full bg-cover bg-no-repeat object-cover object-center align-middle text-none italic leading-0 decoration-0 transition-opacity duration-200 ease-in-out contain-strict",
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
