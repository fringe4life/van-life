import type { PendingVan } from "~/features/vans/types";
import { validateVanType } from "~/features/vans/utils/validators";
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
    type: validateVanType(typeRaw.trim().toUpperCase()),
  };
}
