import type { PendingVan } from '~/features/vans/types';
import { validateVanType } from '~/features/vans/utils/validators';
import { getSlug } from '~/utils/get-slug';

export function pendingVanFromFormData(
	formData: FormData,
	clientKey: string
): PendingVan {
	const name = String(formData.get('name') ?? '');
	const typeRaw = String(formData.get('type') ?? '');
	const discountRaw = formData.get('discount');

	return {
		status: 'pending',
		id: `pending:${clientKey}`,
		clientKey,
		name,
		description: String(formData.get('description') ?? ''),
		type: validateVanType(typeRaw.trim().toUpperCase()),
		imageUrl: String(formData.get('imageUrl') ?? ''),
		price: Number(formData.get('price')),
		discount:
			discountRaw === null || discountRaw === '' ? 0 : Number(discountRaw),
		slug: getSlug(name),
	};
}
