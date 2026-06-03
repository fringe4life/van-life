import { useMemo } from 'react';
import type { HostVanListItem } from '~/features/vans/types';
import { isPendingVan } from '~/features/vans/types';
import type { VanModel } from '~/generated/prisma/models';

interface CreateVanFetcherData {
	clientKey?: string;
	errors?: string;
	formData?: Record<string, FormDataEntryValue>;
	skipListRevalidation?: boolean;
	van?: VanModel;
}

interface UseDisplayHostVansParams {
	fetcherData: CreateVanFetcherData | undefined;
	fetcherState: 'idle' | 'submitting' | 'loading';
	limit: number;
	optimisticItems: HostVanListItem[];
}

export function useDisplayHostVans({
	optimisticItems,
	fetcherData,
	fetcherState,
	limit,
}: UseDisplayHostVansParams): HostVanListItem[] {
	return useMemo(() => {
		const created =
			fetcherState === 'idle' && fetcherData?.van ? fetcherData.van : undefined;

		if (!created) {
			return optimisticItems;
		}

		const clientKey = fetcherData?.clientKey;

		const withoutPending = optimisticItems.filter(
			(item) =>
				!(
					isPendingVan(item) &&
					(item.clientKey === clientKey || item.slug === created.slug)
				)
		);

		const hasCreated = withoutPending.some(
			(item) => !isPendingVan(item) && item.id === created.id
		);

		if (hasCreated) {
			return withoutPending.slice(0, limit);
		}

		return [
			created,
			...withoutPending.filter((item) => !isPendingVan(item)),
		].slice(0, limit);
	}, [optimisticItems, fetcherData, fetcherState, limit]);
}
