import type { ComponentProps, ElementType, ViewTransition } from "react";
import type { OutcomeStateConfig } from "./outcome-state/types";

export interface AsProps<T extends ElementType = "div"> {
  as?: T;
}

export type CollectionOutcome = OutcomeStateConfig;

export interface CollectionOutcomeProps {
  emptyState: CollectionOutcome | null;
  errorState: CollectionOutcome;
  noMatchState: CollectionOutcome | null;
  noMatchWhen?: boolean;
}

export type ViewTransitionTune = Omit<
  ComponentProps<typeof ViewTransition>,
  "children"
>;
