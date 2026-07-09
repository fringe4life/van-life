import type { VanModel } from "~/db/client.server";
import {
  type HostVanListItem,
  isPendingVan,
  type PendingVan,
} from "~/features/vans/types";
import type { UUIDv7 } from "~/types/ids.server";

function pendingToVanCardModel(pending: PendingVan): VanModel {
  return {
    createdAt: new Date(0),
    description: pending.description,
    discount: pending.discount,
    // Optimistic UI placeholder — not a real DB row
    hostId: "" as UUIDv7,
    id: pending.id as UUIDv7,
    imageUrl: pending.imageUrl,
    isRented: false,
    name: pending.name,
    price: pending.price,
    slug: pending.slug,
    state: null,
    type: pending.type,
  };
}

export function toVanCardModel(item: HostVanListItem): VanModel {
  if (isPendingVan(item)) {
    return pendingToVanCardModel(item);
  }
  return item;
}
