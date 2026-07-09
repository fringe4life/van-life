import type { ElementType } from "react";

export interface AsProps<T extends ElementType = "div"> {
  as?: T;
}

export interface EmptyState {
  emptyStateMessage: string;
}

export interface ErrorState {
  errorStateMessage: string;
}
