import {
	AVIF_QUALITY_BOOST,
	DEFAULT_IMAGE_QUALITY,
} from '~/constants/imgConstants';
import { createNewImageSizeWithHeight } from './createNewImageSize';

type ResponsiveConfig = {
	sizes: readonly number[] | number[];
	aspectRatio: number;
	quality?: number;
};

// Constants for better performance and maintainability
const FORMAT_REGEX = /fm=\w+/g;

/**
 * Creates an optimized srcSet with multiple formats (WebP, AVIF) for better compression
 * and browser support. Falls back to JPEG for older browsers.
 *
 * @param imgUrl - The unsplash img url
 * @param mobile - Mobile configuration with sizes and aspect ratio
 * @param desktop - (Optional) Desktop configuration with sizes and aspect ratio
 * @returns a string of all the sizes with appropriate aspect ratios and formats
 */
export function createOptimizedSrcSet(
	imgUrl: string,
	mobile: ResponsiveConfig,
	desktop?: ResponsiveConfig
): string {
	const actualDesktop = desktop ?? mobile;

	// Generate srcSet for different formats
	const formats = [
		{
			ext: 'avif',
			quality: (mobile.quality ?? DEFAULT_IMAGE_QUALITY) + AVIF_QUALITY_BOOST,
		}, // AVIF can handle higher quality
		{ ext: 'webp', quality: mobile.quality ?? DEFAULT_IMAGE_QUALITY },
		{ ext: 'jpg', quality: mobile.quality ?? DEFAULT_IMAGE_QUALITY }, // Fallback
	];

	const generateSrcSetForFormat = (
		config: ResponsiveConfig,
		format: (typeof formats)[0]
	) => {
		return config.sizes
			.map((width) => {
				const height = Math.round(width * config.aspectRatio);
				const url = createNewImageSizeWithHeight(
					imgUrl,
					width,
					height,
					format.quality
				);
				// Replace or add format parameter
				const formatUrl = url.includes('fm=')
					? url.replace(FORMAT_REGEX, `fm=${format.ext}`)
					: `${url}&fm=${format.ext}`;
				return `${formatUrl} ${width}w`;
			})
			.join(', ');
	};

	// Generate srcSets for each format
	const mobileSrcSets = formats.map((format) =>
		generateSrcSetForFormat(mobile, format)
	);
	const desktopSrcSets = formats.map((format) =>
		generateSrcSetForFormat(actualDesktop, format)
	);

	// Combine all formats
	const allSrcSets = [...mobileSrcSets, ...desktopSrcSets];
	return allSrcSets.join(', ');
}

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
			const height = Math.round(width * mobile.aspectRatio);
			const quality = mobile.quality ?? DEFAULT_IMAGE_QUALITY;
			const url = createNewImageSizeWithHeight(imgUrl, width, height, quality);
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
			const height = Math.round(width * actualDesktop.aspectRatio);
			const quality = actualDesktop.quality ?? DEFAULT_IMAGE_QUALITY;
			const url = createNewImageSizeWithHeight(imgUrl, width, height, quality);
			// Ensure WebP format
			const webpUrl = url.includes('fm=')
				? url.replace(FORMAT_REGEX, 'fm=webp')
				: `${url}&fm=webp`;
			return `${webpUrl} ${width}w`;
		})
		.join(', ');

	return `${mobileSrcSet}, ${desktopSrcSet}`;
}
