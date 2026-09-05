import { parseVanType } from "~/features/vans/schema";
import type { PendingVan } from "~/features/vans/types";
import { getSlug } from "~/utils/get-slug";

export function pendingVanFromFormData(
  formData: FormData,
  clientKey: string
): PendingVan {
  const name = String(formData.get("name") ?? "");
  const typeRaw = String(formData.get("type") ?? "");
  const discountRaw = formData.get("discount");

  return {
    clientKey,
    description: String(formData.get("description") ?? ""),
    discount:
      discountRaw === null || discountRaw === "" ? 0 : Number(discountRaw),
    id: `pending:${clientKey}`,
    imageUrl: String(formData.get("imageUrl") ?? ""),
    name,
    price: Number(formData.get("price")),
    slug: getSlug(name),
    status: "pending",
    type: parseVanType(typeRaw),
  };
}
