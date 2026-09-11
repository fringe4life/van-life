import { href } from "react-router";
import type { CustomNavLinkProps } from "~/components/links/custom-nav-link";
import { withSearch } from "~/pagination/utils/with-search";
import type { Id, Prettify } from "~/types";

type HostVanDetailNavItem = Prettify<
  Id & Pick<CustomNavLinkProps, "children" | "end" | "to">
>;

function getHostVanDetailNavItems(vanSlug: string, search = "") {
  return [
    {
      children: "Details",
      end: true,
      id: "details",
      to: withSearch(href("/host/vans/:vanSlug", { vanSlug }), search),
    },
    {
      children: "Pricing",
      id: "pricing",
      to: withSearch(href("/host/vans/:vanSlug/pricing", { vanSlug }), search),
    },
    {
      children: "Photos",
      id: "photos",
      to: withSearch(href("/host/vans/:vanSlug/photos", { vanSlug }), search),
    },
  ] as const satisfies readonly HostVanDetailNavItem[];
}

export type { HostVanDetailNavItem };
export { getHostVanDetailNavItems };
