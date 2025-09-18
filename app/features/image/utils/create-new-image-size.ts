import { DEFAULT_IMAGE_QUALITY } from '~/features/image/img-constants';

const WIDTH_REGEX = /w=\d+/g;
const QUALITY_REGEX = /q=\d+/g;
const ASPECT_RATIO_REGEX = /ar=[^&]+/g;

/**
 * Valid Unsplash aspect ratios with auto-complete support
 */
export type UnsplashAspectRatio =
	| '1:1' // Square
	| '4:3' // Traditional photo
	| '3:2' // Classic photo
	| '16:9' // Widescreen
	| '3:4' // Portrait
	| '2:3'; // Portrait

/**
 * Creates a new Unsplash image URL with specified width and aspect ratio
 * Uses Unsplash's `ar` parameter for better cropping control
 * @param imgSrc the url string from unsplash
 * @param width the new width for the image
 * @param aspectRatio the aspect ratio with auto-complete support
 * @param quality the compression quality (default: 50 for better performance)
 * @returns {string} the url to the img with the new width and aspect ratio
 */
export function createNewImageSizeWithAspectRatio(
	imgSrc: string,
	width: number,
	aspectRatio: UnsplashAspectRatio,
	quality = DEFAULT_IMAGE_QUALITY
): string {
	let result = imgSrc.replace(WIDTH_REGEX, `w=${width}`);

	// Remove any existing height parameter since we're using aspect ratio
	if (result.includes('h=')) {
		result = result.replace(/h=\d+/g, '');
		// Clean up any double ampersands
		result = result.replace(/&&/g, '&');
	}

	// Add or update aspect ratio parameter
	if (result.includes('ar=')) {
		result = result.replace(ASPECT_RATIO_REGEX, `ar=${aspectRatio}`);
	} else {
		// Add aspect ratio parameter
		result += `&ar=${aspectRatio}`;
	}

	// Optimize quality for better compression
	if (result.includes('q=')) {
		result = result.replace(QUALITY_REGEX, `q=${quality}`);
	} else {
		// Add quality parameter if it doesn't exist
		result += `&q=${quality}`;
	}

	// Add modern format optimization
	if (!result.includes('fm=')) {
		result += '&fm=webp';
	}

	return result;
}
