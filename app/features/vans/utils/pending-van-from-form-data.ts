import type { InferOutput } from "valibot";
import type { addVanSchema } from "~/features/vans/schema";
import type { PendingVan } from "~/features/vans/types";
import { getSlug } from "~/utils/get-slug";

type AddVanOutput = InferOutput<typeof addVanSchema>;

export function pendingVanFromFormData(
  validated: AddVanOutput,
  clientKey: string
): PendingVan {
  const { name } = validated;

  return {
    clientKey,
    description: validated.description,
    discount: validated.discount,
    id: `pending:${clientKey}`,
    imageUrl: validated.imageUrl,
    name,
    price: validated.price,
    slug: getSlug(name),
    status: "pending",
    type: validated.type,
  };
}
