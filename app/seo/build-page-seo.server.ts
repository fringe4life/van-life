import { buildPathCanonicalUrl } from "./canonical.server";
import { ABOUT_DESCRIPTION, DEFAULT_DESCRIPTION } from "./constants";
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
