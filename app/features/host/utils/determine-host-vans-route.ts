import type { Params } from '../types';

export const determineHostVansRoute = (params: Params) => {
	const hasAction = Boolean(params.action && typeof params.action === 'string');

	const isEditPage = Boolean(params.action === 'edit');
	const isEditRoute = Boolean(params.action === 'edit');
	const isDetailsView = Boolean(params.action === undefined || !params.action);
	const isPhotosPage = Boolean(params.action === 'photos');
	const isPricingPage = Boolean(params.action === 'pricing');

	const isPhotosView = Boolean(params.action === 'photos');
	const isPricingView = Boolean(params.action === 'pricing');

	return {
		hasAction,
		isEditPage,
		isEditRoute,
		isPhotosPage,
		isPricingPage,
		isDetailsView,
		isPhotosView,
		isPricingView,
	} as const;
};
