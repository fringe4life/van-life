import { href } from "react-router";
import { getSiteOrigin } from "./get-site-origin.server";

export const buildPathCanonicalUrl = (
  request: Request,
  path: "/" | "/about"
): string => {
  const origin = getSiteOrigin(request);
  return `${origin}${path === "/" ? href("/") : href("/about")}`;
};
