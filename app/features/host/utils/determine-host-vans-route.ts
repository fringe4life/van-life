type VanItem = {
	slug: string;
	[key: string]: unknown;
};

type Params = {
	vanSlug?: string;
	action?: string;
};

export function determineHostVansRoute<T extends VanItem>(
	params: Params | undefined,
	vans: T[]
) {
	const hasSlug = Boolean(
		params?.vanSlug && typeof params.vanSlug === 'string'
	);
	const hasAction = Boolean(
		params?.action && typeof params.action === 'string'
	);

	const isMainPage = Boolean(!(hasAction || hasSlug));
	const isEditPage = Boolean(params?.action === 'edit' && hasSlug);
	const isDetailPage = Boolean(params?.action !== 'edit' && hasSlug);
	const isInitialDetailPage = Boolean(params?.action === undefined && hasSlug);
	const isPhotosPage = Boolean(params?.action === 'photos' && hasSlug);
	const isPricingPage = Boolean(params?.action === 'pricing' && hasSlug);

	const selectedVan =
		isDetailPage && vans.find((van) => van.slug === params?.vanSlug);

	return {
		hasSlug,
		hasAction,
		isMainPage,
		isEditPage,
		isDetailPage,
		isInitialDetailPage,
		isPhotosPage,
		isPricingPage,
		selectedVan,
	} as const;
}
