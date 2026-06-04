import { getVanBySlug } from '~/features/vans/dal/van.server';
import { tryCatch } from '~/utils/try-catch.server';

export function loadVanBySlug(slug: string) {
	return tryCatch(() => getVanBySlug(slug));
}
