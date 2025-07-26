import {
	createNewImageSize,
	createNewImageSizeWithHeight,
} from './createNewImageSize';

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

/**
 * @abstract creates a srcSet with different aspect ratios for responsive design
 * @param imgUrl the unsplash img url
 * @param mobileSizes array of sizes for mobile (portrait aspect ratio)
 * @param desktopSizes array of sizes for desktop (landscape aspect ratio)
 * @param mobileAspectRatio aspect ratio for mobile (e.g., 1.5 for 1:1.5)
 * @param desktopAspectRatio aspect ratio for desktop (e.g., 16/9 for 16:9)
 * @returns a string of all the sizes with appropriate aspect ratios
 */
export function createResponsiveSrcSet(
	imgUrl: string,
	mobileSizes: readonly number[] | number[],
	desktopSizes: readonly number[] | number[],
	mobileAspectRatio: number = 1.5,
	desktopAspectRatio: number = 16 / 9,
): string {
	const mobileSrcSet = mobileSizes
		.map((width) => {
			const height = Math.round(width * mobileAspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	const desktopSrcSet = desktopSizes
		.map((width) => {
			const height = Math.round(width / desktopAspectRatio);
			return `${createNewImageSizeWithHeight(imgUrl, width, height)} ${width}w`;
		})
		.join(', ');

	return `${mobileSrcSet}, ${desktopSrcSet}`;
}
