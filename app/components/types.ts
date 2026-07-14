import type { ComponentProps, ElementType, ViewTransition } from "react";

export interface AsProps<T extends ElementType = "div"> {
  as?: T;
}

export interface EmptyState {
  emptyStateMessage: string;
}

export interface ErrorState {
  errorStateMessage: string;
}

export type ViewTransitionTune = Omit<
  ComponentProps<typeof ViewTransition>,
  "children"
>;
