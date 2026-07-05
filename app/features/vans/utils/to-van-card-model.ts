import {
	type HostVanListItem,
	isPendingVan,
	type PendingVan,
} from '~/features/vans/types';
import type { VanModel } from '~/generated/prisma/models';

function pendingToVanCardModel(pending: PendingVan): VanModel {
	return {
		createdAt: new Date(0),
		description: pending.description,
		discount: pending.discount,
		hostId: '',
		id: pending.id,
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
