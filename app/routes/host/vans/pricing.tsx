import { Pricing } from "~/features/vans/components/host-detail/pricing";
import type { Route } from "./+types/pricing";
import { getHostVanDetailLoaderData } from "./host-van-detail-matches";

export default function HostVanPricing({ matches }: Route.ComponentProps) {
  const { van } = getHostVanDetailLoaderData(matches);

  return <Pricing van={van} />;
}
