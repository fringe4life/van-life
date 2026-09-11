import { ViewTransition } from "react";
import { viewTransition } from "styled-system/css";
import type { Children, Prettify } from "~/types";

type DeferredTransitionProps = Prettify<
  Children & {
    phase: "enter" | "exit";
  }
>;

const deferredTransition = viewTransition("fadeSlideSubtle");

/**
 * Animates a Suspense fallback out and its resolved content in without
 * applying a transition to unrelated view-transition boundaries.
 */
const DeferredTransition = ({ children, phase }: DeferredTransitionProps) => (
  <ViewTransition
    default="none"
    enter={phase === "enter" ? deferredTransition : "none"}
    exit={phase === "exit" ? deferredTransition : "none"}
  >
    {children}
  </ViewTransition>
);

export { DeferredTransition };
