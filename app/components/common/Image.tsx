import { useEffect, useState } from 'react';
import canUseDOM from '~/utils/canUseDOM';
import { createNewImageSize } from '~/utils/createNewImageSize';
import { cn } from '~/utils/utils';

/**
 * Extended props for the Image component, extending native img element props
 */
type ImgProps = React.ComponentProps<'img'> & {
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
 * A progressive image loading component that displays a low-resolution placeholder
 * while the full-resolution image loads in the background.
 *
 * Features:
 * - Progressive loading with low-res placeholder
 * - Smooth opacity transition when full image loads
 * - Pulse animation and blur effect during loading
 * - Lazy loading and async decoding for performance
 * - SSR-safe with client-side hydration
 *
 * @param props - The component props
 * @param props.src - The source URL of the image
 * @param props.alt - Alt text for accessibility
 * @param props.className - Additional CSS classes for the img element
 * @param props.classesForContainer - Additional CSS classes for the container div
 * @param props.rest - All other native img element props
 *
 * @example
 * ```tsx
 * <Image
 *   src="https://example.com/image.jpg"
 *   alt="Description"
 *   width={400}
 *   height={300}
 *   className="rounded-lg"
 *   classesForContainer="p-4"
 * />
 * ```
 *
 * @returns A React component that renders a progressively loading image
 */
export default function Image({
	src,
	alt,
	className,
	classesForContainer = '',
	...rest
}: ImgProps) {
	/** Low-resolution placeholder image (20px width) */
	const lowRes = createNewImageSize(src, 20);
	/** State to track if the full-resolution image has loaded */
	const [loaded, setLoaded] = useState(false);
	/** State to store the full-resolution image source */
	const [fullSrc, setFullSrc] = useState<string | null>(null);

	/**
	 * Effect to load the full-resolution image in the background
	 * Only runs on the client side to avoid SSR issues
	 */
	useEffect(() => {
		if (!canUseDOM) return;

		let isCancelled = false;
		const img = new window.Image();
		img.src = src;

		img.onload = () => {
			if (!isCancelled) {
				setFullSrc(src);
				setLoaded(true);
			}
		};

		return () => {
			isCancelled = true;
		};
	}, [src]);

	// Always render the lowRes image initially, swap to fullSrc after load
	return (
		<div className={cn('m-0 p-0', classesForContainer)}>
			<img
				className={cn(
					'h-full max-w-full bg-cover bg-no-repeat object-cover object-center align-middle text-none italic leading-0 decoration-0 transition-opacity duration-200 ease-in-out contain-strict',
					!loaded && 'animate-pulse blur-sm',
					className,
				)}
				loading="lazy"
				decoding="async"
				{...rest}
				alt={alt}
				src={fullSrc || lowRes}
			/>
		</div>
	);
}
