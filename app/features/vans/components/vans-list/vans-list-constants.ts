import { href } from "react-router";
import type { OutcomeStateConfig } from "~/components/outcome-state/types";

export const VANS_LIST_EMPTY_STATE = {
  description: "There are no vans on our site.",
  title: "No vans available yet",
} as const satisfies OutcomeStateConfig;

export const VANS_LIST_ERROR_STATE = {
  description: "We couldn't load the van catalogue. Please try again.",
  title: "Catalogue unavailable",
} as const satisfies OutcomeStateConfig;

export const VANS_LIST_NO_MATCH_STATE = {
  description:
    "Try clearing your search or filters to see every available van.",
  primaryAction: {
    label: "Clear search & filters",
    to: href("/vans"),
  },
  title: "No vans found matching your filters.",
} as const satisfies OutcomeStateConfig;

export const VANS_LIST_RETRY_LABEL = "Try again";
