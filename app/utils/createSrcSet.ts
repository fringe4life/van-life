import { createNewImageSizeWithHeight } from './createNewImageSize';

type ResponsiveConfig = {
	sizes: readonly number[] | number[];
	aspectRatio: number;
};

/**
 * Creates a srcSet with different aspect ratios for responsive design.
 *
 * If desktop config is not provided, mobile config will be used for desktop as well.
 *
 * @param imgUrl - The unsplash img url
 * @param mobile - Mobile configuration with sizes and aspect ratio
 * @param desktop - (Optional) Desktop configuration with sizes and aspect ratio
 * @returns a string of all the sizes with appropriate aspect ratios
 */
export function createResponsiveSrcSet(
	imgUrl: string,
	mobile: ResponsiveConfig,
	desktop?: ResponsiveConfig
): string {
	const actualDesktop = desktop ?? mobile;

	// Calculate mobile srcSet once
	const mobileSrcSet = mobile.sizes
		.map((width) => {
			const height = Math.round(width * mobile.aspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	// If mobile and desktop are the same, return mobile srcSet only
	if (
		actualDesktop.sizes === mobile.sizes &&
		actualDesktop.aspectRatio === mobile.aspectRatio
	) {
		return mobileSrcSet;
	}

	// Create desktop srcSet and combine with mobile
	const desktopSrcSet = actualDesktop.sizes
		.map((width) => {
			const height = Math.round(width * actualDesktop.aspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	return `${mobileSrcSet}, ${desktopSrcSet}`;
}
