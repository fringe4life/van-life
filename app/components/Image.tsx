import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

/**
 * @abstract receives an img from unsplash and lazy loads it
 * @param props the attributes received by an img tag
 * @returns a div with a background image with an img inside that is lazy loaded
 */
export default function Image({
	src,
	alt,
	className,
	...rest
}: React.ComponentProps<'img'>) {
	const [loaded, setLoaded] = useState<boolean>(false);
	const imgRef = useRef<HTMLImageElement>(null);
	// TODO add image not found image, and onError function
	useEffect(() => {
		const onLoad: EventListener = (e) => {
			const target = e.currentTarget as HTMLImageElement;
			console.log({ target, message: 'target' });
			console.log(target.complete);
			if (target.complete) {
				setLoaded(true);

				target.src = src || '';
			}
		};
		if (imgRef.current && !imgRef.current.src) {
			imgRef.current.addEventListener('load', onLoad);
		} else {
			setLoaded(true);
		}
		return () => {
			imgRef.current?.removeEventListener('load', onLoad);
		};
	}, [src]);
	if (!src) return;
	const updatedSrc = src.replace(/w=\d+/g, 'w=20');
	return (
		<div
			className={clsx(
				!loaded && `bg-[url(${updatedSrc})] animate-pulse bg-center bg-cover`,
				' max-w-full transition-opacity duration-200 ease-in-out',
				loaded && 'animate-none bg-none',
			)}
		>
			<img
				ref={imgRef}
				className={clsx(
					'h-auto object-cover object-center opacity-100',
					className,
				)}
				{...rest}
				loading="lazy"
				alt={alt}
				src={src}
			/>
		</div>
	);
}
