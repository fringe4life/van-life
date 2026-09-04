import { createSerializer } from "nuqs/server";
import { href } from "react-router";
import type { VanType } from "~/db/enums";
import { vansParsers } from "~/features/vans/schema";
import { getSiteOrigin } from "./get-site-origin.server";

const serializeCanonicalVanListParams = createSerializer(vansParsers, {
  processUrlSearchParams: (searchParams) => {
    searchParams.sort();
    return searchParams;
  },
});

interface VanListCanonicalParams {
  excludeInRepair: boolean;
  onlyOnSale: boolean;
  search: string;
  types: VanType[];
}

export const buildVanListCanonicalUrl = (
  request: Request,
  params: VanListCanonicalParams
): string => {
  const origin = getSiteOrigin(request);
  const queryString = serializeCanonicalVanListParams({
    excludeInRepair: params.excludeInRepair,
    onlyOnSale: params.onlyOnSale,
    search: params.search,
    types: params.types,
  });

  return queryString
    ? `${origin}${href("/vans")}${queryString}`
    : `${origin}${href("/vans")}`;
};

export const buildVanDetailCanonicalUrl = (
  request: Request,
  vanSlug: string
): string => {
  const origin = getSiteOrigin(request);
  return `${origin}${href("/vans/:vanSlug", { vanSlug })}`;
};

export const buildPathCanonicalUrl = (
  request: Request,
  path: "/" | "/about"
): string => {
  const origin = getSiteOrigin(request);
  return `${origin}${path === "/" ? href("/") : href("/about")}`;
};
