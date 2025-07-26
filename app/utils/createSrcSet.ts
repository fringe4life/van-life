import { createNewImageSizeWithHeight } from './createNewImageSize';

/**
 * Creates a srcSet with different aspect ratios for responsive design.
 *
 * If desktopSizes or desktopAspectRatio are not provided, mobileSizes and mobileAspectRatio will be used for desktop as well.
 *
 * @param imgUrl - The unsplash img url
 * @param mobileSizes - Array of sizes for mobile (portrait aspect ratio)
 * @param desktopSizes - (Optional) Array of sizes for desktop (landscape aspect ratio)
 * @param mobileAspectRatio - Height/width ratio for mobile (e.g., 1.5 for 1:1.5, 0.5625 for 16:9)
 * @param desktopAspectRatio - (Optional) Height/width ratio for desktop (e.g., 0.5625 for 16:9, 0.75 for 4:3)
 * @returns a string of all the sizes with appropriate aspect ratios
 */
export function createResponsiveSrcSet(
	imgUrl: string,
	mobileSizes: readonly number[] | number[],
	desktopSizes?: readonly number[] | number[],
	mobileAspectRatio: number = 1.5,
	desktopAspectRatio?: number,
): string {
	const actualDesktopSizes = desktopSizes ?? mobileSizes;
	const actualDesktopAspectRatio = desktopAspectRatio ?? mobileAspectRatio;

	// Calculate mobile srcSet once
	const mobileSrcSet = mobileSizes
		.map((width) => {
			const height = Math.round(width * mobileAspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	// If mobile and desktop are the same, return mobile srcSet only
	if (
		actualDesktopSizes === mobileSizes &&
		actualDesktopAspectRatio === mobileAspectRatio
	) {
		return mobileSrcSet;
	}

	// Create desktop srcSet and combine with mobile
	const desktopSrcSet = actualDesktopSizes
		.map((width) => {
			const height = Math.round(width * actualDesktopAspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	return `${mobileSrcSet}, ${desktopSrcSet}`;
}
