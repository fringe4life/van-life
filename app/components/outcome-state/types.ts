import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { CustomLinkProps } from "~/components/links/custom-link";
import type { outcomeStateRecipe } from "./outcome-state-recipe";

export type OutcomeKind = "empty" | "error" | "no-match";
export type OutcomeHeadingLevel = "h1" | "h2" | "h3";

interface LinkedOutcomeAction {
  kind?: "link";
  label: string;
  to: CustomLinkProps["to"];
}

interface ReloadOutcomeAction {
  kind: "reload";
  label: string;
  to: string;
}

export type OutcomeStateAction = LinkedOutcomeAction | ReloadOutcomeAction;

export interface OutcomeStateConfig {
  description?: ReactNode;
  headingId?: string;
  headingLevel?: OutcomeHeadingLevel;
  icon?: LucideIcon;
  label?: string;
  metadata?: ReactNode;
  primaryAction?: OutcomeStateAction;
  secondaryAction?: OutcomeStateAction;
  title: ReactNode;
}

export interface OutcomeStateProps extends OutcomeStateConfig {
  className?: string;
  kind: OutcomeKind;
}

export type OutcomeStateStyles = ReturnType<typeof outcomeStateRecipe>;
