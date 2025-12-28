/**
 * Extended props for the Image component, extending native img element props
 */
export type ImgProps = React.ComponentProps<'img'> & {
	/** The source URL of the image */
	src: string;
	/** The width of the image (string or number) */
	width: string | number;
	/** The height of the image (string or number) */
	height: string | number;
	/** Optional srcSet for responsive images */
	srcSet?: string;
	/** Additional CSS classes for the container div */
	classesForContainer?: string;
};
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
 * Responsive configuration for the Image component
 */
export interface ResponsiveConfig {
	sizes: readonly number[] | number[];
	aspectRatio: UnsplashAspectRatio;
	quality?: number;
}
