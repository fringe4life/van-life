import type { ViewTransitionTune } from "~/components/types";

/** Named morph. Mute enter/exit, and share on pager types so list remounts stay quiet. */
const viewTransitionShare = {
  default: "none",
  share: {
    backward: "none",
    default: "auto",
    forward: "none",
  },
} as const satisfies ViewTransitionTune;

/** Named morph plus unpaired enter/exit (`:only-child` CSS still keys off `name`). */
const viewTransitionPage = {
  default: "none",
  enter: "auto",
  exit: "auto",
  share: "auto",
} as const satisfies ViewTransitionTune;

export { viewTransitionPage, viewTransitionShare };
