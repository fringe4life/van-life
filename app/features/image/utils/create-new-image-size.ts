import { DEFAULT_IMAGE_QUALITY } from '~/features/image/img-constants';

const WIDTH_REGEX = /w=\d+/g;
const HEIGHT_REGEX = /h=\d+/g;
const QUALITY_REGEX = /q=\d+/g;

/**
 * @abstract takes a url from unsplash and makes it the desired width and height with optimized compression
 * @param imgSrc the url string from unsplash
 * @param width the new width for the image
 * @param height the new height for the image
 * @param quality the compression quality (default: 50 for better performance)
 * @returns {string} the url to the img with the new width and height
 */
export function createNewImageSizeWithHeight(
	imgSrc: string,
	width: number,
	height: number,
	quality = DEFAULT_IMAGE_QUALITY
): string {
	let result = imgSrc.replace(WIDTH_REGEX, `w=${width}`);

	// Check if height parameter already exists in the URL
	if (result.includes('h=')) {
		// Replace existing height parameter
		result = result.replace(HEIGHT_REGEX, `h=${height}`);
	} else {
		// Add height parameter to the URL
		result = result.replace(WIDTH_REGEX, `w=${width}&h=${height}`);
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
