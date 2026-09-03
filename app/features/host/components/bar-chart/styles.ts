import { css } from "styled-system/css";

export const barHeight = css({
  height:
    "clamp(50px, calc(150px + 100px * sin((pi / 2) * var(--bar-index))), var(--chart-content-height))",
});
