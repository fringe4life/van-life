import { ABOUT_IMG } from "~/features/image/img-constants";
import {
  loadPaginationParams,
  loadSearchParams,
  loadVanFiltersParams,
} from "~/lib/search-params.server";
import {
  buildPathCanonicalUrl,
  buildVanDetailCanonicalUrl,
  buildVanListCanonicalUrl,
} from "./canonical.server";
import {
  ABOUT_DESCRIPTION,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  VANS_DESCRIPTION,
} from "./constants";
import type { PageSeo } from "./types";

export const buildHomePageSeo = (request: Request): PageSeo => ({
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  title: "Home | Van Life",
  url: buildPathCanonicalUrl(request, "/"),
});

export const buildAboutPageSeo = (request: Request): PageSeo => ({
  description: ABOUT_DESCRIPTION,
  image: ABOUT_IMG,
  title: "About | Van Life",
  url: buildPathCanonicalUrl(request, "/about"),
});

export const buildVansPageSeo = (request: Request): PageSeo => {
  const { search } = loadSearchParams(request);
  const { types, excludeInRepair, onlyOnSale } = loadVanFiltersParams(request);
  const { type, vanFilter } = loadPaginationParams(request);

  return {
    description: VANS_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    title: "Vans | Van Life",
    url: buildVanListCanonicalUrl(request, {
      excludeInRepair,
      onlyOnSale,
      search,
      type,
      types,
      vanFilter,
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
