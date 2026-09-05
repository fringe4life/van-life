import { loadVansSearchParams } from "~/features/vans/loaders.server";
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

export const buildHomePageSeo = (request: Request, image: string): PageSeo => ({
  description: DEFAULT_DESCRIPTION,
  image,
  title: "Home | Van Life",
  url: buildPathCanonicalUrl(request, "/"),
});

export const buildAboutPageSeo = (
  request: Request,
  image: string
): PageSeo => ({
  description: ABOUT_DESCRIPTION,
  image,
  title: "About | Van Life",
  url: buildPathCanonicalUrl(request, "/about"),
});

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
