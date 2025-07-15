import clsx from 'clsx';
import { useState } from 'react';
import { createNewImageSize } from '~/utils/createNewImageSize';
import fallbackSrc from '/placeholder.png';

type ImgProps = React.ComponentProps<'img'> & {
	src: string;
};
/**
 * @abstract receives an img from unsplash and lazy loads it
 * @param props the attributes received by an img tag
 * @returns a div with a background image with an img inside that is lazy loaded
 */
export default function Image({ src, alt, className, ...rest }: ImgProps) {
	const [loaded, setLoaded] = useState<boolean>(false);

	const placeholderSrc = createNewImageSize(src, 20);
	return (
		<div
			className={clsx(
				!loaded &&
					`bg-[url(${placeholderSrc})] animate-pulse bg-center bg-cover blur-sm`,
				' max-w-full transition-opacity duration-200 ease-in-out',
				loaded && 'animate-none bg-none blur-none',
			)}
		>
			<img
				className={clsx(
					!loaded && 'opacity-0',
					loaded && ' opacity-100',
					`h-auto object-cover object-center transition-opacity duration-200 ease-in-out, ${className}`,
				)}
				loading="lazy"
				decoding="async"
				{...rest}
				alt={alt}
				src={src}
				onLoad={(e) => {
					if (e.currentTarget.complete) {
						setLoaded(true);
					}
				}}
				onError={(e) => {
					// Handle broken image
					e.currentTarget.src = fallbackSrc;
					setLoaded(true);
				}}
			/>
		</div>
	);
}
