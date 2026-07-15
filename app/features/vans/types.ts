import type { VanModel } from "~/db/client.server";
import type { VanState, VanType } from "~/db/enums";
import type { Maybe, Prettify } from "~/types";

export interface TypeFilter {
  typeFilter: Prettify<Exclude<Maybe<VanType>, null>>;
}

export interface VanFilters {
  excludeInRepair?: boolean;
  onlyOnSale?: boolean;
  types?: string[];
}

/** Lowercase enum value; suffix after `_` when present, else whole value. */
type LowercaseEnumValue<T extends string> =
  T extends `${string}_${infer Suffix}` ? Lowercase<Suffix> : Lowercase<T>;

/** Canonical lowercase van type. */
export type LowercaseVanType = Lowercase<VanType>;

/** Canonical lowercase van state, including runtime-only `new`. */
export type LowercaseVanState = LowercaseEnumValue<VanState> | "new";

export interface VanProps {
  van: VanModel;
}

export type VanCardProps = Prettify<
  VanProps & {
    action: React.ReactElement;
    link: string;
    linkCoversCard?: boolean;
    state?: Record<string, unknown>;
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

export type HostVanListItem = VanModel | PendingVan;

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
