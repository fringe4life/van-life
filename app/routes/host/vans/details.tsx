import { Details } from "~/features/vans/components/host-detail/details";
import type { Route } from "./+types/details";
import { getHostVanDetailLoaderData } from "./host-van-detail-matches";

export default function HostVanDetails({ matches }: Route.ComponentProps) {
  const { van } = getHostVanDetailLoaderData(matches);

  return <Details van={van} />;
}
