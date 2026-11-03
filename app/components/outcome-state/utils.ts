import type { ReactNode } from "react";
import type { IconComponent } from "~/components/icons/icon";
import { PackageOpenIcon } from "~/components/icons/package-open-icon";
import { SearchXIcon } from "~/components/icons/search-x-icon";
import { TriangleAlertIcon } from "~/components/icons/triangle-alert-icon";
import type {
  OutcomeHeadingLevel,
  OutcomeKind,
  OutcomeStateConfig,
} from "./types";

const DEFAULT_LABELS: Record<OutcomeKind, string> = {
  empty: "Empty",
  error: "Error",
  "no-match": "No matches",
};

const DEFAULT_ICONS = {
  empty: PackageOpenIcon,
  error: TriangleAlertIcon,
  "no-match": SearchXIcon,
} as const satisfies Record<OutcomeKind, IconComponent>;

const DEFAULT_HEADING_LEVEL: OutcomeHeadingLevel = "h2";

type ResolvedOutcomeStateConfig = Omit<
  OutcomeStateConfig,
  "headingId" | "headingLevel" | "icon" | "label"
> & {
  headingId: string;
  headingLevel: OutcomeHeadingLevel;
  icon: IconComponent;
  label: string;
};

interface ResolveOutcomeStateConfigOptions {
  config: OutcomeStateConfig;
  generatedHeadingId: string;
  kind: OutcomeKind;
}

export const resolveOutcomeStateConfig = ({
  config,
  generatedHeadingId,
  kind,
}: ResolveOutcomeStateConfigOptions): ResolvedOutcomeStateConfig => ({
  ...config,
  headingId: config.headingId ?? `outcome-state-${generatedHeadingId}`,
  headingLevel: config.headingLevel ?? DEFAULT_HEADING_LEVEL,
  icon: config.icon ?? DEFAULT_ICONS[kind],
  label: config.label ?? DEFAULT_LABELS[kind],
});

type OutcomeStateVisibilityInput = Pick<
  OutcomeStateConfig,
  "description" | "metadata" | "primaryAction" | "secondaryAction"
>;

interface OutcomeStateVisibility {
  hasActions: boolean;
  hasAside: boolean;
  hasDescription: boolean;
  hasMetadata: boolean;
}

const hasValue = (value: ReactNode | undefined): boolean =>
  value !== undefined && value !== null;

export const getOutcomeStateVisibility = ({
  description,
  metadata,
  primaryAction,
  secondaryAction,
}: OutcomeStateVisibilityInput): OutcomeStateVisibility => {
  const hasDescription = hasValue(description);
  const hasMetadata = hasValue(metadata);
  const hasActions =
    primaryAction !== undefined || secondaryAction !== undefined;

  return {
    hasActions,
    hasAside: hasMetadata || hasActions,
    hasDescription,
    hasMetadata,
  };
};
