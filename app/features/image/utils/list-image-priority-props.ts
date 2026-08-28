import type { ImgHTMLAttributes } from "react";
import { LIST_EAGER_IMAGE_COUNT } from "~/features/image/img-constants";

type ListImagePriorityProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "decoding" | "fetchPriority" | "loading"
>;

const listImagePriorityProps = (index: number): ListImagePriorityProps => {
  const isEager = index < LIST_EAGER_IMAGE_COUNT;
  const isLcpCandidate = index === 0;

  return {
    decoding: isLcpCandidate ? "sync" : "async",
    fetchPriority: isEager ? "high" : "auto",
    loading: isEager ? "eager" : "lazy",
  } satisfies ListImagePriorityProps;
};

export { listImagePriorityProps };
