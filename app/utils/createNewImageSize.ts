/**
 * @abstract takes a url from unsplash and makes it the desired size
 * @param imgSrc the url string from unsplash
 * @param newSize the new width for the image
 * @returns {string} the url to the img with the new size
 */
export function createNewImageSize(imgSrc: string, newSize: number): string {
	return imgSrc.replace(/w=\d+/g, `w=${newSize}`);
}

/**
 * @abstract takes a url from unsplash and makes it the desired width and height
 * @param imgSrc the url string from unsplash
 * @param width the new width for the image
 * @param height the new height for the image
 * @returns {string} the url to the img with the new width and height
 */
export function createNewImageSizeWithHeight(
	imgSrc: string,
	width: number,
	height: number,
): string {
	let result = imgSrc.replace(/w=\d+/g, `w=${width}`);

	// Check if height parameter already exists in the URL
	if (result.includes('h=')) {
		// Replace existing height parameter
		result = result.replace(/h=\d+/g, `h=${height}`);
	} else {
		// Add height parameter to the URL
		result = result.replace(/w=\d+/, `w=${width}&h=${height}`);
	}

	return result;
}
