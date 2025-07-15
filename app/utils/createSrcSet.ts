import { createNewImageSize } from './createNewImageSize';

export function createSrcSet(imgSizes: number[], imgUrl: string): string {
	return imgSizes
		.map((size) => `${createNewImageSize(imgUrl, size)} ${size}w`)
		.join(', ');
}
