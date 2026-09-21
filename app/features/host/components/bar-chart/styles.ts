import { css } from "styled-system/css";

/**
 * Loading-only silhouette. Heights intentionally do not follow color-band order:
 * the real bar heights depend on unavailable data while the chart is loading.
 */
export const barHeight = css({
  "&:nth-child(1)": { blockSize: "61%" },
  "&:nth-child(2)": { blockSize: "37%" },
  "&:nth-child(3)": { blockSize: "82%" },
  "&:nth-child(4)": { blockSize: "47%" },
  "&:nth-child(5)": { blockSize: "69%" },
});
