import type { VanModel } from "~/db/client.server";
import { VanState, type VanType } from "~/db/enums";
import type { Prettify } from "~/types";

export interface VanFilters {
  excludeInRepair?: boolean;
  onlyOnSale?: boolean;
  types?: string[];
}

export const ListingChrome = {
  ...VanState,
  NEW: "NEW",
} as const;

export type ListingChrome = (typeof ListingChrome)[keyof typeof ListingChrome];

export type VanWithChrome = Prettify<
  VanModel & {
    listingChrome: ListingChrome;
  }
>;

export interface VanProps {
  van: VanWithChrome;
}

export type VanCardProps = Prettify<
  VanProps & {
    action: React.ReactElement;
    imageIndex?: number;
    link: string;
    linkCoversCard?: boolean;
    priceTransitionName?: string;
  }
>;

export interface PendingVan {
  clientKey: string;
  description: string;
  discount: number;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  slug: string;
  status: "pending";
  type: VanType;
}

export type HostVanListItem = VanWithChrome | PendingVan;

export function isPendingVan(item: HostVanListItem): item is PendingVan {
  return "status" in item && item.status === "pending";
}

/** Van columns the add-van form actually edits (HTML string values). */
export const VAN_FORM_FIELDS = [
  "name",
  "price",
  "description",
  "imageUrl",
  "type",
  "discount",
] as const satisfies ReadonlyArray<keyof VanModel>;

export type VanFormFieldKey = (typeof VAN_FORM_FIELDS)[number];

/** Van form has no secrets — echo = all form fields. */
export const VAN_ECHO_FIELDS = VAN_FORM_FIELDS;

export type VanFormValues = {
  [K in VanFormFieldKey]?: string;
};

export type VanFormFieldErrors = {
  [K in VanFormFieldKey]?: string;
};
