import {
	type HostVanListItem,
	isPendingVan,
	type PendingVan,
} from '~/features/vans/types';
import type { VanModel } from '~/generated/prisma/models';

function pendingToVanCardModel(pending: PendingVan): VanModel {
	return {
		id: pending.id,
		name: pending.name,
		price: pending.price,
		description: pending.description,
		imageUrl: pending.imageUrl,
		type: pending.type,
		hostId: '',
		isRented: false,
		createdAt: new Date(0),
		state: null,
		discount: pending.discount,
		slug: pending.slug,
	};
}

export function toVanCardModel(item: HostVanListItem): VanModel {
	if (isPendingVan(item)) {
		return pendingToVanCardModel(item);
	}
	return item;
}
