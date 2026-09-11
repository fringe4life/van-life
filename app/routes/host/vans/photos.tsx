import { Photos } from "~/features/vans/components/host-detail/photos";
import type { Route } from "./+types/photos";
import { getHostVanDetailLoaderData } from "./host-van-detail-matches";

export default function HostVanPhotos({ matches }: Route.ComponentProps) {
  const { van } = getHostVanDetailLoaderData(matches);

  return <Photos van={van} />;
}
