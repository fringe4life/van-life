import {
	DEFAULT_IMAGE_QUALITY,
	FORMAT_REGEX,
} from '~/features/image/img-constants';
import type { ResponsiveConfig } from '../types';
import { createNewImageSizeWithAspectRatio } from './create-new-image-size';

/**
 * Creates a simple optimized srcSet with WebP format for better compression
 * This is a lighter version that only uses WebP format
 *
 * @param imgUrl - The unsplash img url
 * @param mobile - Mobile configuration with sizes and aspect ratio
 * @param desktop - (Optional) Desktop configuration with sizes and aspect ratio
 * @returns a string of all the sizes with WebP format
 */
export function createWebPSrcSet(
	imgUrl: string,
	mobile: ResponsiveConfig,
	desktop?: ResponsiveConfig
): string {
	const actualDesktop = desktop ?? mobile;

	// Calculate mobile srcSet once
	const mobileSrcSet = mobile.sizes
		.map((width) => {
			const quality = mobile.quality ?? DEFAULT_IMAGE_QUALITY;
			const url = createNewImageSizeWithAspectRatio(
				imgUrl,
				width,
				mobile.aspectRatio,
				quality
			);
			// Ensure WebP format
			const webpUrl = url.includes('fm=')
				? url.replace(FORMAT_REGEX, 'fm=webp')
				: `${url}&fm=webp`;
			return `${webpUrl} ${width}w`;
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
			const quality = actualDesktop.quality ?? DEFAULT_IMAGE_QUALITY;
			const url = createNewImageSizeWithAspectRatio(
				imgUrl,
				width,
				actualDesktop.aspectRatio,
				quality
			);
			// Ensure WebP format
			const webpUrl = url.includes('fm=')
				? url.replace(FORMAT_REGEX, 'fm=webp')
				: `${url}&fm=webp`;
			return `${webpUrl} ${width}w`;
		})
		.join(', ');

	return `${mobileSrcSet}, ${desktopSrcSet}`;
}
