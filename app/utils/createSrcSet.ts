import { createNewImageSize } from './createNewImageSize';

/**
 * @abstract takes an array of numbers and a url from unsplash and creates mutliple sizes for it
 * @param imgSizes an array of numbers of the sizes of images you want
 * @param imgUrl the unsplash img url
 * @returns a string of all the sizes of the image so the browser can determine which size of image to use
 */
export function createSrcSet(
	imgSizes: readonly number[] | number[],
	imgUrl: string,
): string {
	return imgSizes
		.map((size) => `${createNewImageSize(imgUrl, size)} ${size}w`)
		.join(', ');
}
