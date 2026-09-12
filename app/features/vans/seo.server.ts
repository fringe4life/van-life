import { createSerializer } from "nuqs/server";
import { href } from "react-router";
import type { VanType } from "~/db/enums";
import { DEFAULT_OG_IMAGE, VANS_DESCRIPTION } from "~/seo/constants";
import { getSiteOrigin } from "~/seo/get-site-origin.server";
import type { PageSeo } from "~/seo/types";
import { loadVansSearchParams } from "./loaders.server";
import { vansParsers } from "./parsers";

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

const buildVanListCanonicalUrl = (
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

const buildVanDetailCanonicalUrl = (
  request: Request,
  vanSlug: string
): string => {
  const origin = getSiteOrigin(request);
  return `${origin}${href("/vans/:vanSlug", { vanSlug })}`;
};

export const buildVansPageSeo = (request: Request): PageSeo => {
  const { search, types, excludeInRepair, onlyOnSale } =
    loadVansSearchParams(request);

  return {
    description: VANS_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    title: "Vans | Van Life",
    url: buildVanListCanonicalUrl(request, {
      excludeInRepair,
      onlyOnSale,
      search,
      types,
    }),
  };
};

export const buildVanDetailPageSeo = (
  request: Request,
  van: { name: string; description: string; imageUrl: string; slug: string }
): PageSeo => ({
  description: `${van.name} - ${van.description}`,
  image: van.imageUrl,
  title: `${van.name} | Van Life`,
  url: buildVanDetailCanonicalUrl(request, van.slug),
});
